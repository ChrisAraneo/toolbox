import { lstatSync } from 'node:fs';
import { dirname, sep } from 'node:path';

export const getParentDirectory = (path: string): string => {
  let isFile: boolean;

  try {
    isFile = lstatSync(path).isFile();
  } catch {
    // If there is error, we skip the path.
    isFile = false;
  }

  if (isFile) {
    return dirname(path) || '.';
  }

  const parts = dirname(path).split(sep);
  parts.pop();

  return (parts.join(sep) || '.').trim();
};
