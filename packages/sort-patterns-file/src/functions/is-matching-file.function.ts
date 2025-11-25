// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const { minimatch } = require('minimatch');

export const isMatchingFile = (pattern: string, files: string[]): boolean => {
  let isMatching = false;

  for (let i = 0; i < files.length && !isMatching; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (minimatch(files[i], pattern)) {
      isMatching = true;
    }
  }

  return isMatching;
};
