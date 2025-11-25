const LOG_TIME_PRECISION = 6;

export const getTimeDiff = (startTime: number): string =>
  (performance.now() - startTime).toPrecision(LOG_TIME_PRECISION);
