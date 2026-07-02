import fs from 'node:fs';
import path from 'node:path';

import { createFileSystemPathInfos } from './create-file-system-path-infos.function';

jest.mock('fs', () => ({
  lstatSync: jest.fn(),
}));

jest.mock('path', () => ({
  normalize: jest.fn((p) => p),
}));

describe('createFileSystemPathInfos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when given empty array', () => {
    const paths: string[] = [];

    const result = createFileSystemPathInfos(paths);

    expect(result).toEqual([]);
  });

  it('should create path info for a single file', () => {
    const paths = ['src/index.ts'];
    (fs.lstatSync as jest.Mock).mockReturnValue({
      isDirectory: () => false,
      isFile: () => true,
    });

    const result = createFileSystemPathInfos(paths);

    expect(result).toEqual([
      {
        path: 'src/index.ts',
        isDirectory: false,
        isFile: true,
      },
    ]);
  });

  it('should create path info for a single directory', () => {
    const paths = ['src'];
    (fs.lstatSync as jest.Mock).mockReturnValue({
      isDirectory: () => true,
      isFile: () => false,
    });

    const result = createFileSystemPathInfos(paths);

    expect(result).toEqual([
      {
        path: 'src',
        isDirectory: true,
        isFile: false,
      },
    ]);
  });

  it('should create path infos for multiple paths', () => {
    const paths = ['src', 'lib/main.ts', 'test'];
    (fs.lstatSync as jest.Mock)
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      });

    const result = createFileSystemPathInfos(paths);

    expect(result).toEqual([
      {
        path: 'src',
        isDirectory: true,
        isFile: false,
      },
      {
        path: 'lib/main.ts',
        isDirectory: false,
        isFile: true,
      },
      {
        path: 'test',
        isDirectory: true,
        isFile: false,
      },
    ]);
  });

  it('should trim whitespace from paths', () => {
    const paths = ['  src/index.ts  ', ' lib '];
    (fs.lstatSync as jest.Mock)
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      });

    const result = createFileSystemPathInfos(paths);

    expect(result).toEqual([
      {
        path: 'src/index.ts',
        isDirectory: false,
        isFile: true,
      },
      {
        path: 'lib',
        isDirectory: true,
        isFile: false,
      },
    ]);
  });

  it('should filter out empty strings', () => {
    const paths = ['src', '', '  ', 'lib'];
    (fs.lstatSync as jest.Mock)
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      });

    const result = createFileSystemPathInfos(paths);

    expect(result).toEqual([
      {
        path: 'src',
        isDirectory: true,
        isFile: false,
      },
      {
        path: 'lib',
        isDirectory: true,
        isFile: false,
      },
    ]);
  });

  it('should normalize paths', () => {
    const paths = ['src/utils/../index.ts'];
    (path.normalize as jest.Mock).mockReturnValueOnce('src/index.ts');
    (fs.lstatSync as jest.Mock).mockReturnValue({
      isDirectory: () => false,
      isFile: () => true,
    });

    const result = createFileSystemPathInfos(paths);

    expect(path.normalize).toHaveBeenCalledWith('src/utils/../index.ts');
    expect(result).toEqual([
      {
        path: 'src/index.ts',
        isDirectory: false,
        isFile: true,
      },
    ]);
  });

  it('should handle paths with mixed file types', () => {
    const paths = [
      'package.json',
      'src',
      'README.md',
      'node_modules',
      'test.ts',
    ];
    (fs.lstatSync as jest.Mock)
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      })
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      })
      .mockReturnValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      });

    const result = createFileSystemPathInfos(paths);

    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({
      path: 'package.json',
      isDirectory: false,
      isFile: true,
    });
    expect(result[1]).toEqual({
      path: 'src',
      isDirectory: true,
      isFile: false,
    });
  });

  it('should call lstatSync for each valid path', () => {
    const paths = ['src', 'lib', 'test'];
    (fs.lstatSync as jest.Mock).mockReturnValue({
      isDirectory: () => true,
      isFile: () => false,
    });

    createFileSystemPathInfos(paths);

    expect(fs.lstatSync).toHaveBeenCalledTimes(6);
    expect(fs.lstatSync).toHaveBeenNthCalledWith(1, 'src');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(2, 'src');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(3, 'lib');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(4, 'lib');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(5, 'test');
    expect(fs.lstatSync).toHaveBeenNthCalledWith(6, 'test');
  });
});
