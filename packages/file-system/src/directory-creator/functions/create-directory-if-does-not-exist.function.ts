import { Logger } from '@chris.araneo/logger';

import { FileSystem } from '../../file-system/file-system.class';

const logDirectoryExists = (logger: Logger) =>
  logger.debug('Directory already exists');

const logCreatingDirectory = (logger: Logger, directory: string) =>
  logger.debug(`Creating directory: '${directory}'`);

const logDirectoryCreated = (logger: Logger) =>
  logger.debug('Created directory');

const createDirectory = async (
  fileSystem: FileSystem,
  logger: Logger,
  directory: string,
) => {
  logCreatingDirectory(logger, directory);

  return fileSystem
    .mkdir(directory, { recursive: true })
    .then(() => {
      logDirectoryCreated(logger);
    })
    .catch((error: unknown) => {
      throw new Error(`Can't create directory: ${error}`);
    });
};

const skip = async (logger: Logger) => logDirectoryExists(logger);

export const createDirectoryIfDoesNotExist =
  (fileSystem: FileSystem, logger: Logger) => (directory: string) =>
    fileSystem.existsSync(directory)
      ? skip(logger)
      : createDirectory(fileSystem, logger, directory);
