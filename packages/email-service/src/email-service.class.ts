import { Logger } from '@chris.araneo/logger';
import Express from 'express';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { Server } from 'http';
import { ParsedQs } from 'qs';

// import { EnvVarKey } from './env-var-key.type';

export class EmailService {
  // private env?: Record<string, string | undefined>;
  private server?: Server;

  constructor(private readonly logger: Logger) {
    this.logger.info('Email Service v0.0.11');

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
    respone: Response<unknown, Record<string, unknown>, number>,
  ): void {
    // const { TEXT_TEMPLATE, HTML_TEMPLATE, SENDER, NAME, RECEIVER, SUBJECT } =
    //   this.getEnvironmentVariablesOrThrow();

    // const body = request.body;

    // const text = Mustache.render(TEXT_TEMPLATE, body);
    // const html = Mustache.render(HTML_TEMPLATE, body);

    respone.send({
      status: 'error',
      message: 'Email sending service client not implemented yet',
    });
  }

  // private getEnvironmentVariablesOrThrow(): Record<EnvVarKey, string> {
  //   if (!this.env) {
  //     this.env = { ...process.env };
  //   }

  //   const result: Record<EnvVarKey, string> = {
  //     SENDER: '',
  //     NAME: '',
  //     SUBJECT: '',
  //     RECEIVER: '',
  //     TEXT_TEMPLATE: '',
  //     HTML_TEMPLATE: '',
  //   };

  //   (Object.keys(result) as EnvVarKey[]).forEach((key: EnvVarKey) => {
  //     const value = this.env?.[key];

  //     if (!value) {
  //       throw new Error(
  //         `${key} environment variable is undefined but it is required`,
  //       );
  //     }

  //     result[key] = value;
  //   });

  //   return result;
  // }
}
