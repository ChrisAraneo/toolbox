import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from 'winston';

import { LogLevel } from './log-level.type';
import { Meta } from './meta.type';
const { combine, timestamp, printf, colorize, prettyPrint, simple } = format;

// Stryker disable all

export class Logger {
  private logger!: WinstonLogger;

  constructor(
    private logLevel: LogLevel = 'info',
    private areWarningsIgnored = true,
  ) {
    if (this.areWarningsIgnored) {
      this.ignoreWarnings();
    }

    this.initialize();
  }

  debug(message: string, ...meta: Meta[]): void {
    this.logger.debug(message, ...meta);
  }

  info(message: string, ...meta: Meta[]): void {
    this.logger.info(message, ...meta);
  }

  warn(message: string, ...meta: Meta[]): void {
    this.logger.warn(message, ...meta);
  }

  error(message: string, ...meta: Meta[]): void {
    this.logger.error(message, ...meta);
  }

  setLogLevel(logLevel: LogLevel = 'info'): void {
    this.logLevel = logLevel;
    this.initialize();
  }

  private initialize(): void {
    this.logger = createLogger({
      level: this.logLevel,
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:MM:SS',
        }),
        prettyPrint(),
        format.splat(),
        simple(),
        printf((msg) => {
          const message = msg.message;
          const splat = msg[Symbol.for('splat')];
          const iso = new Date().toISOString();
          const parts = iso.split('.');

          return colorize().colorize(
            msg.level,
            `[${parts[0].replace('T', ' ')}] [${msg.level.toLocaleUpperCase()}] - ${message}${
              splat ? ' ' + JSON.stringify(splat) : ''
            }`,
          );
        }),
      ),
      transports: [new transports.Console()],
    });
  }

  private ignoreWarnings(): void {
    console.warn = (): undefined => {
      return;
    };
  }
}
