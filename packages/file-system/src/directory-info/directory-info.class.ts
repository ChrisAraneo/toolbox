// Stryker disable all

import { FileSystem } from '../file-system/file-system.class';
import { getContents } from './functions/get-contents.function';

export class DirectoryInfo {
  readonly getContents: (
    directory: string,
  ) => ReturnType<ReturnType<typeof getContents>>;

  constructor(fileSystem: FileSystem = new FileSystem()) {
    this.getContents = getContents(fileSystem);
  }
}
