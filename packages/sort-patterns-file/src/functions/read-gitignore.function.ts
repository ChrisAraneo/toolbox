import { readFile } from 'node:fs';
import { normalize, sep } from 'node:path';

export const readGitignore = async (): Promise<string[]> =>
  new Promise((resolve) => {
    const gitignorePath = normalize(`${process.cwd() + sep}.gitignore`);

    readFile(gitignorePath, 'utf8', (error, data: string) => {
      if (error) {
        resolve([]);

        return;
      }

      const entries = data
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('#'));

      console.log(`Ignoring ${entries.length} entries from .gitignore`);

      resolve(entries);
    });
  });
