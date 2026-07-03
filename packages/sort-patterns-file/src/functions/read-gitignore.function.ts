import { readFile } from 'node:fs';
import { normalize, sep } from 'node:path';

import { chain } from 'lodash-es';
import { match, P } from 'ts-pattern';

const toGitignoreEntries = (data: string): string[] =>
  chain(data.split('\n'))
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0 && !line.startsWith('#'))
    .value();

const resolveEntries = (
  resolve: (entries: string[]) => void,
  error: NodeJS.ErrnoException | null,
  data: string,
): void =>
  match(error)
    .with(P.not(null), () => resolve([]))
    .otherwise(() => {
      const entries = toGitignoreEntries(data);

      console.log(`Ignoring ${entries.length} entries from .gitignore`);

      resolve(entries);
    });

export const readGitignore = async (): Promise<string[]> =>
  new Promise((resolve) => {
    readFile(
      normalize(`${process.cwd() + sep}.gitignore`),
      'utf8',
      (error, data: string) => resolveEntries(resolve, error, data),
    );
  });
