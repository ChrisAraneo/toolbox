import { Logger } from '@chris.araneo/logger';
import express from 'express';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import Mustache from 'mustache';
import Mailjet, { Client } from 'node-mailjet';
import { ParsedQs } from 'qs';

import { EnvVarKey } from './env-var-key.type';

export class EmailService {
  private env?: Record<string, string | undefined>;
  private mailjet?: Client;

  constructor(private readonly logger: Logger) {
    this.logger.info('Email Service v0.0.5');

    this.logger.debug(
      `Environmental variables: ${JSON.stringify({ ...process.env, ['MJ_APIKEY_PRIVATE']: undefined })}`,
    );

    const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } =
      this.getEnvironmentVariablesOrThrow();

    try {
      this.mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
    } catch (error: unknown) {
      this.logger.error('Mailjet API connect error: ' + JSON.stringify(error));
    }
  }

  listen(endpoint: string, port: number): void {
    const app = express();

    app.get(endpoint, (request, respone) => {
      this.logger.info(`GET ${endpoint}`);

      this.handleRequest(request, respone);
    });

    app.listen(port);

    this.logger.info(`Email service running at port ${port}`);
  }

  handleRequest(
    request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    respone: Response<any, Record<string, any>, number>,
  ): void {
    const { TEXT_TEMPLATE, HTML_TEMPLATE, SENDER, NAME, RECEIVER, SUBJECT } =
      this.getEnvironmentVariablesOrThrow();

    const body = request.body;

    const text = Mustache.render(TEXT_TEMPLATE, body);
    const html = Mustache.render(HTML_TEMPLATE, body);

    if (!this.mailjet) {
      return this.logger.error(`Mailjet is undefined`);
    }

    this.mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: SENDER,
              Name: NAME,
            },
            To: [
              {
                Email: RECEIVER,
              },
            ],
            Subject: SUBJECT,
            TextPart: text,
            HTMLPart: html,
          },
        ],
      })
      .then((result) => {
        this.logger.info(`Result: ${result.body}`);

        respone.send({ status: 'success' });
      })
      .catch((error) => {
        this.logger.error(`Result: ${JSON.stringify(error)}`);

        respone.send({ status: 'error', message: error });
      });
  }

  private getEnvironmentVariablesOrThrow(): Record<EnvVarKey, string> {
    if (!this.env) {
      this.env = { ...process.env };
    }

    const result: Record<EnvVarKey, string> = {
      MJ_APIKEY_PUBLIC: '',
      MJ_APIKEY_PRIVATE: '',
      SENDER: '',
      NAME: '',
      SUBJECT: '',
      RECEIVER: '',
      TEXT_TEMPLATE: '',
      HTML_TEMPLATE: '',
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
