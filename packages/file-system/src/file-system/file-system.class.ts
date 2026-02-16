// Stryker disable all

import { find } from '@chris.araneo/find';
import fsPromises from 'fs/promises';
import fs from 'fs';

export class FileSystem {
  readonly readdir = fsPromises.readdir;
  readonly stat = fsPromises.stat;
  readonly readFile = fsPromises.readFile;
  readonly writeFile = fsPromises.writeFile;
  readonly existsSync = fs.existsSync;
  readonly mkdir = fsPromises.mkdir;
  readonly find = find;
}
