// Stryker disable all

import { FileSystem } from '../file-system/file-system.class';
import {
  writeBase64File,
  writeBase64Files,
} from './functions/write-base64-file.function';

export class Base64FileWriter {
  readonly writeFile: ReturnType<typeof writeBase64File>;
  readonly writeFiles: ReturnType<typeof writeBase64Files>;

  constructor(fileSystem: FileSystem) {
    this.writeFile = writeBase64File(fileSystem);
    this.writeFiles = writeBase64Files(fileSystem);
  }
}
