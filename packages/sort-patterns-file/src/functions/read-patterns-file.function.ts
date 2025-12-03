import { readFile } from 'node:fs';
import { normalize, sep } from 'node:path';

export const readPatternsFile = async (path: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    readFile(
      normalize(process.cwd() + sep + path),
      'utf8',
      (error, data: string) => {
        if (error) {
          reject(error);
        } else {
          const parts = data
            .split('\n')
            .map((part) => part.replaceAll(/[\n\r]/gu, ''))
            .filter(Boolean);

          resolve(parts);
        }
      },
    );
  });
