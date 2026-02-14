// Stryker disable all

import { FileSystem } from '../file-system/file-system.class';
import { readBase64File } from './functions/read-base64-file.function';

export class Base64FileReader {
  readonly readFile: ReturnType<typeof readBase64File>;

  constructor(fileSystem: FileSystem) {
    this.readFile = readBase64File(fileSystem);
  }
}
