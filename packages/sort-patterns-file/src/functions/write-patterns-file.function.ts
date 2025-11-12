import * as fs from 'node:fs';

export const writePatternsFile = async (
  path: string,
  patterns: string[],
): Promise<void> =>
  new Promise((resolve, reject) => {
    fs.writeFile(
      path,
      `${patterns
        .map((pattern) => pattern.trim())
        .filter(Boolean)
        .join('\n')}\n`,
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
