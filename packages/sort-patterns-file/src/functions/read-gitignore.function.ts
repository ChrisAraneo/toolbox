import { readFile } from 'node:fs';
import { normalize, sep } from 'node:path';

import { chain } from 'lodash-es';

export const readGitignore = async (): Promise<string[]> =>
  new Promise((resolve) => {
    const gitignorePath = normalize(`${process.cwd() + sep}.gitignore`);

    readFile(gitignorePath, 'utf8', (error, data: string) => {
      if (error) {
        resolve([]);

        return;
      }

      const entries = chain(data.split('\n'))
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('#'))
        .value();

      console.log(`Ignoring ${entries.length} entries from .gitignore`);

      resolve(entries);
    });
  });
