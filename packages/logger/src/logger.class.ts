// Stryker disable all

import { chain, head, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from 'winston';

import { LogLevel } from './log-level.type';
import { Meta } from './meta.type';
const { combine, timestamp, printf, colorize, prettyPrint, simple } = format;
const { when } = P;

export class Logger {
  private logger!: WinstonLogger;

  constructor(
    private logLevel: LogLevel = 'info',
    private readonly areWarningsIgnored = true,
  ) {
    chain(this.areWarningsIgnored)
      .thru((ignored) =>
        match(ignored)
          .with(true, () => this.ignoreWarnings())
          .otherwise(noop),
      )
      .thru(() => this.initialize())
      .value();
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
    chain(logLevel)
      .thru((level) => {
        this.logLevel = level;
      })
      .thru(() => this.initialize())
      .value();
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
        printf((msg) =>
          chain({
            message: msg.message,
            splat: msg[Symbol.for('splat')],
            timePart: head(new Date().toISOString().split('.'))?.replace(
              'T',
              ' ',
            ),
          })
            .thru(
              ({ message, splat, timePart }) =>
                `[${timePart}] [${msg.level.toLocaleUpperCase()}] - ${message}${match(
                  splat,
                )
                  .with(when(Boolean), (value) => ` ${JSON.stringify(value)}`)
                  .otherwise(() => '')}`,
            )
            .thru((line) => colorize().colorize(msg.level, line))
            .value(),
        ),
      ),
      transports: [new transports.Console()],
    });
  }

  private ignoreWarnings(): void {
    console.warn = noop;
  }
}
