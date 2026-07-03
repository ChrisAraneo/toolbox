import { Server } from 'node:http';
import process from 'node:process';

import { Logger } from '@chris.araneo/logger';
import Express from 'express';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { chain, now } from 'lodash-es';
import { ParsedQs } from 'qs';
import { tryCatch } from 'ramda';
import { match, P } from 'ts-pattern';

const { nonNullable: NON_NULLABLE } = P;

const HTTP_SERVICE_UNAVAILABLE = 503;

export class HealthCheckService {
  private server?: Server;

  constructor(private readonly logger: Logger) {}

  listen(endpoint: string, port: number): void {
    chain(Express())
      .thru((express) => {
        express.get(endpoint, (_, response) => this.handleRequest(_, response));

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
          this.logger.info(`Health check service listening on port ${port}`);
        });
      })
      .value();
  }

  handleRequest(
    _: Request<
      ParamsDictionary,
      unknown,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    response: Response<unknown, Record<string, unknown>>,
  ): void {
    chain<{ uptime: number; message: unknown; timestamp: number }>({
      uptime: process.uptime(),
      message: 'OK',
      timestamp: now(),
    })
      .thru((healthcheck) => tryCatch(
          () => {
            response.send(healthcheck);
            this.logger.debug(`Health OK`);
          },
          (error: unknown) => {
            healthcheck.message = error;
            response.status(HTTP_SERVICE_UNAVAILABLE).send();
          },
        )(),
      )
      .value();
  }
}
