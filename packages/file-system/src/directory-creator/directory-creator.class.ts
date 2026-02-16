// Stryker disable all

import { Logger } from '@chris.araneo/logger';

import { FileSystem } from '../file-system/file-system.class';
import { createDirectoryIfDoesNotExist } from './functions/create-directory-if-does-not-exist.function';

export class DirectoryCreator {
  readonly createIfDoesNotExist: (directory: string) => Promise<void>;

  constructor(fileSystem: FileSystem, logger: Logger) {
    this.createIfDoesNotExist = createDirectoryIfDoesNotExist(
      fileSystem,
      logger,
    );
  }
}
