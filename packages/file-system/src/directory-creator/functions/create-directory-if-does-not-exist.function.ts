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
  await new Promise<void>((resolve, reject) =>
    fileSystem.mkdirSync(directory, { recursive: true }, (error, path) =>
      error || !path ? reject("Can't create directory") : resolve(),
    ),
  );
  logDirectoryCreated(logger);
};

const skip = async (logger: Logger) => logDirectoryExists(logger);

export const createDirectoryIfDoesNotExist =
  (fileSystem: FileSystem, logger: Logger) => (directory: string) =>
    fileSystem.existsSync(directory)
      ? skip(logger)
      : createDirectory(fileSystem, logger, directory);
