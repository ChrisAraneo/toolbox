// Stryker disable all

import { Logger } from '@chris.araneo/logger';

import { FileSystem } from '../file-system/file-system.class';
import { createIfDoesntExist } from './functions/create-if-doesnt-exist.function';

export class DirectoryCreator {
  readonly createIfDoesntExistSync: (directory: string) => Promise<void>;

  constructor(fileSystem: FileSystem, logger: Logger) {
    this.createIfDoesntExistSync = createIfDoesntExist(fileSystem, logger);
  }
}
