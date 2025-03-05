import process from 'node:process';

import { Logger } from '@chris.araneo/logger';
import Express from 'express';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { Server } from 'http';
import { ParsedQs } from 'qs';

export class HealthCheckService {
  private server?: Server;

  constructor(private readonly logger: Logger) {}

  listen(endpoint: string, port: number): void {
    const express = Express();

    express.get(endpoint, (_, response) => this.handleRequest(_, response));

    if (this.server) {
      this.server.closeAllConnections();
      this.server.close();
    }

    this.server = express.listen(port, () => {
      this.logger.info(`Health check service listening on port ${port}`);
    });
  }

  handleRequest(
    _: Request<
      ParamsDictionary,
      unknown,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    response: Response<unknown, Record<string, unknown>, number>,
  ): void {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK' as string | unknown,
      timestamp: Date.now(),
    };

    try {
      response.send(healthcheck);
      this.logger.debug(`Health OK`);
    } catch (error) {
      healthcheck.message = error;
      response.status(503).send();
    }
  }
}
