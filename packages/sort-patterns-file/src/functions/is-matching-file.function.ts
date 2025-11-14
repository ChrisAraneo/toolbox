import { minimatch } from 'minimatch';

export const isMatchingFile = (pattern: string, files: string[]): boolean => {
  let isMatching = false;

  for (let i = 0; i < files.length && !isMatching; i++) {
    if (minimatch(files[i], pattern)) {
      isMatching = true;
    }
  }

  return isMatching;
};
