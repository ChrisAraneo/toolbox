import { lstatSync } from 'node:fs';
import { dirname, sep } from 'node:path';

import { chain, initial, trim } from 'lodash-es';
import { tryCatch } from 'ramda';
import { match } from 'ts-pattern';

// If there is error, we skip the path.
const isFilePath = tryCatch(
  (path: string) => lstatSync(path).isFile(),
  () => false,
);

const toFileParent = (path: string): string => dirname(path) || '.';

const toDirectoryParent = (path: string): string =>
  chain(dirname(path))
    .thru((dir) => dir.split(sep))
    .thru(initial)
    .thru((parts) => parts.join(sep))
    .thru((joined) => joined || '.')
    .thru(trim)
    .value();

export const getParentDirectory = (path: string): string =>
  match(isFilePath(path))
    .with(true, () => toFileParent(path))
    .otherwise(() => toDirectoryParent(path));
