import { Logger } from '@chris.araneo/logger';

import { FileSystem } from '../../file-system/file-system.class';
import { createDirectoryIfDoesNotExist } from './create-directory-if-does-not-exist.function';

describe('createDirectoryIfDoesNotExist', () => {
  let mockFileSystem: jest.Mocked<FileSystem>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockFileSystem = {
      existsSync: jest.fn(),
      mkdir: jest.fn(),
    } as any;

    mockLogger = {
      debug: jest.fn(),
    } as any;
  });

  describe('when directory exists', () => {
    it('should skip creation and log that directory exists', async () => {
      const directory = '/path/to/existing/directory';
      mockFileSystem.existsSync.mockReturnValue(true);

      const createDirectory = createDirectoryIfDoesNotExist(
        mockFileSystem,
        mockLogger,
      );
      await createDirectory(directory);

      expect(mockFileSystem.existsSync).toHaveBeenCalledWith(directory);
      expect(mockFileSystem.mkdir).not.toHaveBeenCalled();
      expect(mockLogger.debug).toHaveBeenCalledWith('Directory already exists');
    });
  });

  describe('when directory does not exist', () => {
    it('should create directory and log creation steps', async () => {
      const directory = '/path/to/new/directory';
      mockFileSystem.existsSync.mockReturnValue(false);
      mockFileSystem.mkdir.mockResolvedValue();

      const createDirectory = createDirectoryIfDoesNotExist(
        mockFileSystem,
        mockLogger,
      );
      await createDirectory(directory);

      expect(mockFileSystem.existsSync).toHaveBeenCalledWith(directory);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        `Creating directory: '${directory}'`,
      );
      expect(mockFileSystem.mkdir).toHaveBeenCalledWith(directory, {
        recursive: true,
      });
      expect(mockLogger.debug).toHaveBeenCalledWith('Created directory');
    });

    it('should create directory with recursive option', async () => {
      const directory = '/path/to/nested/new/directory';
      mockFileSystem.existsSync.mockReturnValue(false);
      mockFileSystem.mkdir.mockResolvedValue();

      const createDirectory = createDirectoryIfDoesNotExist(
        mockFileSystem,
        mockLogger,
      );
      await createDirectory(directory);

      expect(mockFileSystem.mkdir).toHaveBeenCalledWith(directory, {
        recursive: true,
      });
    });

    it('should throw error when directory creation fails', async () => {
      const directory = '/path/to/new/directory';
      const error = new Error('Permission denied');
      mockFileSystem.existsSync.mockReturnValue(false);
      mockFileSystem.mkdir.mockRejectedValue(error);

      const createDirectory = createDirectoryIfDoesNotExist(
        mockFileSystem,
        mockLogger,
      );

      await expect(createDirectory(directory)).rejects.toThrow(
        `Can't create directory: ${error}`,
      );
      expect(mockFileSystem.mkdir).toHaveBeenCalledWith(directory, {
        recursive: true,
      });
    });
  });

  describe('curried function behavior', () => {
    it('should return a partially applied function', () => {
      const createDirectory = createDirectoryIfDoesNotExist(
        mockFileSystem,
        mockLogger,
      );

      expect(typeof createDirectory).toBe('function');
    });

    it('should work with different directories using the same instance', async () => {
      const directory1 = '/path/to/dir1';
      const directory2 = '/path/to/dir2';

      mockFileSystem.existsSync.mockReturnValue(false);
      mockFileSystem.mkdir.mockResolvedValue();

      const createDirectory = createDirectoryIfDoesNotExist(
        mockFileSystem,
        mockLogger,
      );

      await createDirectory(directory1);
      await createDirectory(directory2);

      expect(mockFileSystem.mkdir).toHaveBeenCalledTimes(2);
      expect(mockFileSystem.mkdir).toHaveBeenNthCalledWith(1, directory1, {
        recursive: true,
      });
      expect(mockFileSystem.mkdir).toHaveBeenNthCalledWith(2, directory2, {
        recursive: true,
      });
    });
  });

  describe('logging behavior', () => {
    it('should log in the correct order during creation', async () => {
      const directory = '/path/to/new/directory';
      const logCalls: string[] = [];

      mockFileSystem.existsSync.mockReturnValue(false);
      mockFileSystem.mkdir.mockResolvedValue();
      mockLogger.debug.mockImplementation((message: string) => {
        logCalls.push(message);
      });

      const createDirectory = createDirectoryIfDoesNotExist(
        mockFileSystem,
        mockLogger,
      );
      await createDirectory(directory);

      expect(logCalls).toEqual([
        `Creating directory: '${directory}'`,
        'Created directory',
      ]);
    });

    it('should only log "exists" message when directory already exists', async () => {
      const directory = '/path/to/existing/directory';
      mockFileSystem.existsSync.mockReturnValue(true);

      const createDirectory = createDirectoryIfDoesNotExist(
        mockFileSystem,
        mockLogger,
      );
      await createDirectory(directory);

      expect(mockLogger.debug).toHaveBeenCalledTimes(1);
      expect(mockLogger.debug).toHaveBeenCalledWith('Directory already exists');
    });
  });
});
