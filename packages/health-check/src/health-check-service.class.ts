import process from 'node:process';

import { Logger } from '@chris.araneo/logger';
import Express from 'express';
import { Server } from 'http';

export class HealthCheckService {
  private server?: Server;

  constructor(
    private readonly endpoint: string,
    private readonly port: number,
    private readonly logger: Logger,
  ) {}

  async listen(): Promise<void> {
    const express = Express();

    express.get(this.endpoint, async (_, response) => {
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
    });

    if (this.server) {
      this.server.closeAllConnections();
      this.server.close();
    }

    this.server = express.listen(this.port, () => {
      this.logger.info(`Health check service has started at port ${this.port}`);
    });
  }
}
