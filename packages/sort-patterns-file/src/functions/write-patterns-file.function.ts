import * as fs from 'fs';

export async function writePatternsFile(
  path: string,
  patterns: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path,
      patterns
        .map((pattern) => pattern.trim())
        .filter(Boolean)
        .join('\n') + '\n',
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
}
