// Stryker disable all

import { find } from '@chris.araneo/find';
import fs from 'node:fs';

export class FileSystem {
  readdir = fs.readdir;
  stat = fs.stat;
  readFile = fs.readFile;
  writeFile = fs.writeFile;
  existsSync = fs.existsSync;
  mkdirSync = fs.mkdir;
  find = find;
}
