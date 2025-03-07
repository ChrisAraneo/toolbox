import * as fs from 'fs';

export async function writePatternsFile(
  path: string,
  patterns: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, patterns.join('\n'), 'utf8', (e) => {
      if (e) {
        reject(e);
      } else {
        resolve();
      }
    });
  });
}
