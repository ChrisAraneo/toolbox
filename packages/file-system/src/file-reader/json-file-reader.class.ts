// Stryker disable all

import { FileSystem } from '../file-system/file-system.class';
import { readJsonFile } from './functions/read-json-file.function';

export class JsonFileReader {
  readonly readFile: ReturnType<typeof readJsonFile>;

  constructor(fileSystem: FileSystem) {
    this.readFile = readJsonFile(fileSystem);
  }
}
