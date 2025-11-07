import { readFile } from 'node:fs';
import { normalize, sep } from 'node:path';

export async function readPatternsFile(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readFile(normalize(process.cwd() + sep + path), 'utf8', (e, data) => {
      if (e) {
        reject(e);
      } else {
        const parts = data
          .split('\n')
          .map((part) => part.replaceAll('\r', ''))
          .map((part) => part.replaceAll('\n', ''))
          .filter(Boolean);

        resolve(parts);
      }
    });
  });
}
