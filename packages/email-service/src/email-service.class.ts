import { Server } from 'node:http';

import { Logger } from '@chris.araneo/logger';
import Express from 'express';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { chain, keys, omit, reduce } from 'lodash-es';
import fetch from 'make-fetch-happen';
import Mustache from 'mustache';
import { ParsedQs } from 'qs';
import { tryCatch } from 'ramda';
import { match, P } from 'ts-pattern';

import { EnvVarKey } from './env-var-key.type';

const { when, nonNullable: NON_NULLABLE } = P;

const EMPTY_ENV_VARS: Record<EnvVarKey, string> = {
  FROM_EMAIL: '',
  FROM_NAME: '',
  TO_EMAIL: '',
  TO_NAME: '',
  NAME: '',
  SUBJECT: '',
  RECEIVER: '',
  TEXT_TEMPLATE: '',
  HTML_TEMPLATE: '',
  MAILERSEND_TOKEN: '',
};

// eslint-disable-next-line unicorn/prefer-native-coercion-functions -- Boolean() alone is not a type predicate; narrowing to `string` requires this shape.
const isNonEmptyString = (value: string | undefined): value is string => Boolean(value);

const mergeError = (previous: unknown, next: unknown): unknown => next ?? previous;

const captureError = <T>(
  tryer: () => T,
  fallback: T,
  onError?: (error: unknown) => void,
): { value: T; error: unknown } => tryCatch(
    (): { value: T; error: unknown } => ({ value: tryer(), error: null }),
    (error: unknown): { value: T; error: unknown } => {
      onError?.(error);

      return { value: fallback, error };
    },
  )();

const renderTemplates = (
  envVars: Record<EnvVarKey, string>,
  requestBody: unknown,
): { text: string; html: string; error: unknown } => {
  const { value: text, error: textError } = captureError(
    () => Mustache.render(envVars.TEXT_TEMPLATE, requestBody),
    '',
  );
  const { value: html, error: htmlError } = captureError(
    () => Mustache.render(envVars.HTML_TEMPLATE, requestBody),
    '',
  );

  return { text, html, error: mergeError(textError, htmlError) };
};

const buildEmailBody = (
  envVars: Record<EnvVarKey, string>,
  text: string,
  html: string,
  previousError: unknown,
  logger: Logger,
): { body: string; error: unknown } => {
  const bodyObject = {
    from: {
      email: envVars.FROM_EMAIL,
      name: envVars.FROM_NAME,
    },
    to: [
      {
        email: envVars.TO_EMAIL,
        name: envVars.TO_NAME,
      },
    ],
    subject: envVars.SUBJECT,
    text,
    html,
    personalization: [],
  };
  const { value: body, error: bodyError } = captureError(
    () => JSON.stringify(bodyObject),
    '',
    () => {
      logger.error('Could not stringify body');
      console.error(bodyObject);
    },
  );

  return { body, error: mergeError(previousError, bodyError) };
};

export class EmailService {
  private env?: Record<string, string | undefined>;
  private server?: Server;

  constructor(private readonly logger: Logger) {
    chain(omit(process.env, ['MJ_APIKEY_PRIVATE']))
      .thru((env) => {
        this.logger.info('Email Service v0.0.16');
        this.logger.debug(`Environmental variables: ${JSON.stringify(env)}`);
      })
      .value();
  }

  listen(endpoint: string, port: number): void {
    chain(Express())
      .thru((express) => {
        express.get(endpoint, (request, response) => {
          this.logger.debug(`GET ${endpoint}`);

          this.handleRequest(request, response);
        });

        return express;
      })
      .thru((express) => match(this.server)
          .with(NON_NULLABLE, (server) => {
            server.closeAllConnections();
            server.close();

            return express;
          })
          .otherwise(() => express),
      )
      .thru((express) => {
        this.server = express.listen(port, () => {
          this.logger.info(`Email service listening on port ${port}`);
        });
      })
      .value();
  }

  handleRequest(
    request: Request<
      ParamsDictionary,
      unknown,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    response: Response<unknown, Record<string, unknown>>,
  ): void {
    const envVars = this.getEnvironmentVariablesOrThrow();

    chain(renderTemplates(envVars, request.body))
      .thru(({ text, html, error }) => buildEmailBody(envVars, text, html, error, this.logger),
      )
      .thru(({ body, error }) => match(error)
          .with(when(Boolean), (err) => this.reportError(err))
          .otherwise(() => this.sendEmail(body, envVars.MAILERSEND_TOKEN, response)),
      )
      .value();
  }

  private reportError(error: unknown): void {
    console.error(error);
    this.logger.error(JSON.stringify(error));
  }

  private sendEmail(
    body: string,
    mailersendToken: string,
    response: Response<unknown, Record<string, unknown>>,
  ): void {
    fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mailersendToken}`,
      },
    })
      .then(async (fetchResponse) => fetchResponse.json())
      .then(() => {
        this.logger.info(body);
        response.send({ status: 'success', message: 'E-mail sent' });
      })
      .catch((error: unknown) => {
        console.error(error);
        this.logger.error(JSON.stringify(error));

        response.send({
          status: 'error',
          message: 'Error while sending email',
        });
      });
  }

  private getEnvironmentVariablesOrThrow(): Record<EnvVarKey, string> {
    return chain(this.env ?? { ...process.env })
      .thru((env) => {
        this.env = env;

        return env;
      })
      .thru((env) => reduce(
          keys(EMPTY_ENV_VARS),
          (accumulator, key) => ({
            ...accumulator,
            [key as EnvVarKey]: match(env[key])
              .with(when(isNonEmptyString), (value) => value)
              .otherwise(() => {
                throw new Error(
                  `${key} environment variable is undefined but it is required`,
                );
              }),
          }),
          EMPTY_ENV_VARS,
        ),
      )
      .value();
  }
}
