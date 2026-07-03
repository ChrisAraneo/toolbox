import { readFile } from 'node:fs';
import { normalize, sep } from 'node:path';

import { chain } from 'lodash-es';
import { match, P } from 'ts-pattern';

const toPatternLines = (data: string): string[] =>
  chain(data.split('\n'))
    .map((part: string) => part.replaceAll(/[\n\r]/gu, ''))
    .filter(Boolean)
    .value();

const settle = (
  resolve: (value: string[]) => void,
  reject: (reason: unknown) => void,
  error: NodeJS.ErrnoException | null,
  data: string,
): void =>
  match(error)
    .with(P.not(null), (e) => reject(e))
    .otherwise(() => resolve(toPatternLines(data)));

export const readPatternsFile = async (path: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    readFile(
      normalize(process.cwd() + sep + path),
      'utf8',
      (error, data: string) => settle(resolve, reject, error, data),
    );
  });
