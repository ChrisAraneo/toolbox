// Stryker disable all

import { FileSystem } from '../file-system/file-system.class';
import { readTextFile } from './functions/read-text-file.function';

export class TextFileReader {
  readonly readFile: ReturnType<typeof readTextFile>;

  constructor(fileSystem: FileSystem) {
    this.readFile = readTextFile(fileSystem);
  }
}
