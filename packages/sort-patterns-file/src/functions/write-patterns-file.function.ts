import * as fs from 'node:fs';

import { chain } from 'lodash-es';

export const writePatternsFile = async (
  path: string,
  patterns: string[],
): Promise<void> => new Promise((resolve, reject) => {
    fs.writeFile(
      path,
      `${chain(patterns)
        .map((pattern) => pattern.trim())
        .filter(Boolean)
        .join('\n')
        .value()}\n`,
      'utf8',
      (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      },
    );
  });
