import * as fs from 'node:fs';

import { chain } from 'lodash-es';
import { match, P } from 'ts-pattern';

const toFileContent = (patterns: string[]): string =>
  `${chain(patterns)
    .map((pattern: string) => pattern.trim())
    .filter(Boolean)
    .join('\n')
    .value()}\n`;

const settle = (
  resolve: () => void,
  reject: (reason: unknown) => void,
  error: NodeJS.ErrnoException | null,
): void =>
  match(error)
    .with(P.not(null), (e) => reject(e))
    .otherwise(() => resolve());

export const writePatternsFile = async (
  path: string,
  patterns: string[],
): Promise<void> =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, toFileContent(patterns), 'utf8', (error) =>
      settle(resolve, reject, error),
    );
  });
