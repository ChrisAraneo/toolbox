import { Logger } from '@chris.araneo/logger';
import express from 'express';
import Mustache from 'mustache';
import Mailjet, { Client } from 'node-mailjet';

export class EmailService {
  private env: Record<string, string | undefined>;

  constructor(
    private readonly endpoint: string,
    private readonly port: number,
    private readonly logger: Logger,
  ) {
    this.env = { ...process.env };

    this.logger.info('Email Service v0.0.2');

    this.logger.debug(
      `Environmental variables: ${JSON.stringify({ ...this.env, ['MJ_APIKEY_PRIVATE']: undefined })}`,
    );
  }

  listen(): void {
    const {
      MJ_APIKEY_PUBLIC,
      MJ_APIKEY_PRIVATE,
      SENDER,
      NAME,
      SUBJECT,
      RECEIVER,
      TEXT_TEMPLATE,
      HTML_TEMPLATE,
    } = this.env;

    const app = express();

    let mailjet: Client;

    if (!MJ_APIKEY_PUBLIC) {
      return this.logger.error(`MJ_APIKEY_PUBLIC is undefined`);
    }

    if (!MJ_APIKEY_PRIVATE) {
      return this.logger.error(`MJ_APIKEY_PRIVATE is undefined`);
    }

    try {
      mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
    } catch (error: unknown) {
      this.logger.error('Mailjet API connect error: ' + JSON.stringify(error));
    }

    app.get(this.endpoint, (request, respone) => {
      const body = request.body;

      if (!TEXT_TEMPLATE) {
        return this.logger.error(`TEXT_TEMPLATE is undefined`);
      }

      const text = Mustache.render(TEXT_TEMPLATE, body);

      if (!HTML_TEMPLATE) {
        return this.logger.error(`HTML_TEMPLATE is undefined`);
      }

      const html = Mustache.render(HTML_TEMPLATE, body);

      mailjet
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
    });

    app.listen(this.port);

    this.logger.info(`Server running at port ${this.port}`);
  }
}
