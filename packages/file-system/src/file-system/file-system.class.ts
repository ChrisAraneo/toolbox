// Stryker disable all

import fs from 'node:fs';
import fsPromises from 'node:fs/promises';

import { find } from '@chris.araneo/find';

export class FileSystem {
  readonly readdir = fsPromises.readdir;
  readonly stat = fsPromises.stat;
  readonly readFile = fsPromises.readFile;
  readonly writeFile = fsPromises.writeFile;
  readonly existsSync = fs.existsSync;
  readonly mkdir = fsPromises.mkdir;
  readonly find = find;
}
