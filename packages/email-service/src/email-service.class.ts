import { Logger } from '@chris.araneo/logger';
import Express from 'express';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { Server } from 'http';
import fetch from 'make-fetch-happen';
import Mustache from 'mustache';
import { ParsedQs } from 'qs';

import { EnvVarKey } from './env-var-key.type';

export class EmailService {
  private env?: Record<string, string | undefined>;
  private server?: Server;

  constructor(private readonly logger: Logger) {
    this.logger.info('Email Service v0.0.12');

    this.logger.debug(
      `Environmental variables: ${JSON.stringify({ ...process.env, ['MJ_APIKEY_PRIVATE']: undefined })}`,
    );
  }

  listen(endpoint: string, port: number): void {
    const express = Express();

    express.get(endpoint, (request, response) => {
      this.logger.debug(`GET ${endpoint}`);

      this.handleRequest(request, response);
    });

    if (this.server) {
      this.server.closeAllConnections();
      this.server.close();
    }

    this.server = express.listen(port, () => {
      this.logger.info(`Email service listening on port ${port}`);
    });
  }

  handleRequest(
    request: Request<
      ParamsDictionary,
      unknown,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    response: Response<unknown, Record<string, unknown>, number>,
  ): void {
    const {
      TEXT_TEMPLATE,
      HTML_TEMPLATE,
      FROM_EMAIL,
      FROM_NAME,
      TO_EMAIL,
      TO_NAME,
      SUBJECT,
      MAILERSEND_TOKEN,
    } = this.getEnvironmentVariablesOrThrow();

    const requestBody = request.body;
    let text = '';
    let html = '';
    let error: unknown = null;

    try {
      text = Mustache.render(TEXT_TEMPLATE, requestBody);
    } catch (e: unknown) {
      error = e;
    }

    try {
      html = Mustache.render(HTML_TEMPLATE, requestBody);
    } catch (e: unknown) {
      error = e;
    }

    if (error) {
      console.error(error);
      this.logger.error(JSON.stringify(error));

      return;
    }

    const body = {
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      to: [
        {
          email: TO_EMAIL,
          name: TO_NAME,
        },
      ],
      subject: SUBJECT,
      text: text,
      html: html,
      personalization: [],
    };

    fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MAILERSEND_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
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
    if (!this.env) {
      this.env = { ...process.env };
    }

    const result: Record<EnvVarKey, string> = {
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

    (Object.keys(result) as EnvVarKey[]).forEach((key: EnvVarKey) => {
      const value = this.env?.[key];

      if (!value) {
        throw new Error(
          `${key} environment variable is undefined but it is required`,
        );
      }

      result[key] = value;
    });

    return result;
  }
}
