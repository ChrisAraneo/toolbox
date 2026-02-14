// Stryker disable all

import { FileSystem } from '../file-system/file-system.class';
import {
  writeTextFile,
  writeTextFiles,
} from './functions/write-text-file.function';

export class TextFileWriter {
  readonly writeFile: ReturnType<typeof writeTextFile>;
  readonly writeFiles: ReturnType<typeof writeTextFiles>;

  constructor(fileSystem: FileSystem) {
    this.writeFile = writeTextFile(fileSystem);
    this.writeFiles = writeTextFiles(fileSystem);
  }
}
