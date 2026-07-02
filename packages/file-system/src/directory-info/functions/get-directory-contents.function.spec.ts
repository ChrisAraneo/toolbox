import { firstValueFrom } from 'rxjs';

import { FileSystem } from '../../file-system/file-system.class';
import { getDirectoryContents } from './get-directory-contents.function';

describe('getDirectoryContents', () => {
  let mockFileSystem: jest.Mocked<FileSystem>;

  beforeEach(() => {
    mockFileSystem = {
      readdir: jest.fn() as any,
    } as any;
  });

  describe('successful directory reading', () => {
    it('should return observable with directory contents', async () => {
      const directory = '/path/to/directory';
      const contents = ['file1.txt', 'file2.txt', 'folder1'];
      mockFileSystem.readdir.mockResolvedValue(contents as any);

      const getContents = getDirectoryContents(mockFileSystem);
      const result = await firstValueFrom(getContents(directory));

      expect(mockFileSystem.readdir).toHaveBeenCalledWith(directory);
      expect(result).toEqual(contents);
    });

    it('should return empty array for empty directory', async () => {
      const directory = '/path/to/empty';
      mockFileSystem.readdir.mockResolvedValue([]);

      const getContents = getDirectoryContents(mockFileSystem);
      const result = await firstValueFrom(getContents(directory));

      expect(result).toEqual([]);
    });

    it('should return multiple items in directory', async () => {
      const directory = '/path/to/directory';
      const contents = [
        'file1.txt',
        'file2.js',
        'folder1',
        'folder2',
        '.hidden',
      ];
      mockFileSystem.readdir.mockResolvedValue(contents as any);

      const getContents = getDirectoryContents(mockFileSystem);
      const result = await firstValueFrom(getContents(directory));

      expect(result).toEqual(contents);
      expect(result).toHaveLength(5);
    });
  });

  describe('error handling', () => {
    it('should propagate error when directory does not exist', async () => {
      const directory = '/non/existent/directory';
      const error = new Error('ENOENT: no such file or directory');
      mockFileSystem.readdir.mockRejectedValue(error);

      const getContents = getDirectoryContents(mockFileSystem);

      await expect(firstValueFrom(getContents(directory))).rejects.toThrow(
        error,
      );
    });

    it('should propagate error when permission denied', async () => {
      const directory = '/restricted/directory';
      const error = new Error('EACCES: permission denied');
      mockFileSystem.readdir.mockRejectedValue(error);

      const getContents = getDirectoryContents(mockFileSystem);

      await expect(firstValueFrom(getContents(directory))).rejects.toThrow(
        error,
      );
    });
  });

  describe('curried function behavior', () => {
    it('should return a partially applied function', () => {
      const getContents = getDirectoryContents(mockFileSystem);

      expect(typeof getContents).toBe('function');
    });

    it('should work with multiple directories using same instance', async () => {
      const directory1 = '/path/to/dir1';
      const directory2 = '/path/to/dir2';
      const contents1 = ['file1.txt'];
      const contents2 = ['file2.txt', 'file3.txt'];

      mockFileSystem.readdir
        .mockResolvedValueOnce(contents1 as any)
        .mockResolvedValueOnce(contents2 as any);

      const getContents = getDirectoryContents(mockFileSystem);

      const result1 = await firstValueFrom(getContents(directory1));
      const result2 = await firstValueFrom(getContents(directory2));

      expect(result1).toEqual(contents1);
      expect(result2).toEqual(contents2);
      expect(mockFileSystem.readdir).toHaveBeenCalledTimes(2);
    });
  });

  describe('observable behavior', () => {
    it('should emit value and complete', (done) => {
      const directory = '/path/to/directory';
      const contents = ['file1.txt', 'file2.txt'];
      mockFileSystem.readdir.mockResolvedValue(contents as any);

      const getContents = getDirectoryContents(mockFileSystem);
      const observable = getContents(directory);

      let emissionCount = 0;

      observable.subscribe({
        next: (value) => {
          emissionCount++;
          expect(value).toEqual(contents);
        },
        complete: () => {
          expect(emissionCount).toBe(1);
          done();
        },
        error: (error) => {
          done(error);
        },
      });
    });
  });

  describe('path handling', () => {
    it('should handle Windows-style paths', async () => {
      const directory = String.raw`C:\Users\username\Documents`;
      const contents = ['file.txt'];
      mockFileSystem.readdir.mockResolvedValue(contents as any);

      const getContents = getDirectoryContents(mockFileSystem);
      const result = await firstValueFrom(getContents(directory));

      expect(mockFileSystem.readdir).toHaveBeenCalledWith(directory);
      expect(result).toEqual(contents);
    });

    it('should handle Unix-style paths', async () => {
      const directory = '/home/username/documents';
      const contents = ['file.txt'];
      mockFileSystem.readdir.mockResolvedValue(contents as any);

      const getContents = getDirectoryContents(mockFileSystem);
      const result = await firstValueFrom(getContents(directory));

      expect(mockFileSystem.readdir).toHaveBeenCalledWith(directory);
      expect(result).toEqual(contents);
    });

    it('should handle relative paths', async () => {
      const directory = './relative/path';
      const contents = ['file.txt'];
      mockFileSystem.readdir.mockResolvedValue(contents as any);

      const getContents = getDirectoryContents(mockFileSystem);
      const result = await firstValueFrom(getContents(directory));

      expect(mockFileSystem.readdir).toHaveBeenCalledWith(directory);
      expect(result).toEqual(contents);
    });
  });
});
