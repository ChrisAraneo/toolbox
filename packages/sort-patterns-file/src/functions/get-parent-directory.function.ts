import { lstatSync } from 'node:fs';
import { dirname, sep } from 'node:path';

export const getParentDirectory = (path: string): string => {
  if (lstatSync(path).isFile()) {
    return dirname(path) || '.';
  }
  const parts = dirname(path).split(sep);
  parts.pop();

  return parts.join(sep) || '.';
};
