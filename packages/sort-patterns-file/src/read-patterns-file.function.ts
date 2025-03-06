import { readFile } from 'fs';
import { normalize, sep } from 'path';

export async function readPatternsFile(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readFile(normalize(process.cwd() + sep + path), 'utf8', (e, data) => {
      if (e) {
        reject(e);
      } else {
        const parts = data
          .split('\n')
          .map((part) => part.replaceAll('\r', ''))
          .map((part) => part.replaceAll('\n', ''));

        resolve(parts);
      }
    });
  });
}
