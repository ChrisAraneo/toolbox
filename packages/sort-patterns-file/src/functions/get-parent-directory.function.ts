import { lstatSync } from 'fs';
import { dirname, sep } from 'path';

export function getParentDirectory(path: string): string {
  if (lstatSync(path).isFile()) {
    return dirname(path) || '.';
  } else {
    const parts = dirname(path).split(sep);
    parts.pop();

    return parts.join(sep) || '.';
  }
}
