import { FileSystemPathInfo } from '../interfaces/file-system-path-info.interface';
import { createFileSystemNodeMap } from './create-file-system-node-map.function';

jest.mock('./get-parent-directory.function', () => ({
  getParentDirectory: jest.fn((path: string) => {
    const parts = path.split('/');
    return parts.length > 1 ? parts.slice(0, -1).join('/') : null;
  }),
}));

describe('createFileSystemNodeMap', () => {
  it('should return empty map when given empty array', () => {
    const infos: FileSystemPathInfo[] = [];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({});
  });

  it('should create map with single directory', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'src', isDirectory: true, isFile: false },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      src: {
        name: 'src',
        parentDirectory: null,
        files: [],
      },
    });
  });

  it('should create map with single file and its parent directory', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'src/index.ts', isDirectory: false, isFile: true },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      src: {
        name: 'src',
        parentDirectory: null,
        files: ['src/index.ts'],
      },
    });
  });

  it('should group multiple files under the same directory', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'src/index.ts', isDirectory: false, isFile: true },
      { path: 'src/main.ts', isDirectory: false, isFile: true },
      { path: 'src/utils.ts', isDirectory: false, isFile: true },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      src: {
        name: 'src',
        parentDirectory: null,
        files: ['src/index.ts', 'src/main.ts', 'src/utils.ts'],
      },
    });
  });

  it('should handle mixed directories and files', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'src', isDirectory: true, isFile: false },
      { path: 'src/index.ts', isDirectory: false, isFile: true },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      src: {
        name: 'src',
        parentDirectory: null,
        files: ['src/index.ts'],
      },
    });
  });

  it('should handle nested directories', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'src', isDirectory: true, isFile: false },
      { path: 'src/utils', isDirectory: true, isFile: false },
      { path: 'src/utils/helper.ts', isDirectory: false, isFile: true },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      src: {
        name: 'src',
        parentDirectory: null,
        files: [],
      },
      'src/utils': {
        name: 'src/utils',
        parentDirectory: 'src',
        files: ['src/utils/helper.ts'],
      },
    });
  });

  it('should handle multiple directories with files', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'src/index.ts', isDirectory: false, isFile: true },
      { path: 'lib/main.ts', isDirectory: false, isFile: true },
      { path: 'test/spec.ts', isDirectory: false, isFile: true },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      src: {
        name: 'src',
        parentDirectory: null,
        files: ['src/index.ts'],
      },
      lib: {
        name: 'lib',
        parentDirectory: null,
        files: ['lib/main.ts'],
      },
      test: {
        name: 'test',
        parentDirectory: null,
        files: ['test/spec.ts'],
      },
    });
  });

  it('should trim whitespace from directory names', () => {
    const infos: FileSystemPathInfo[] = [
      { path: '  src  ', isDirectory: true, isFile: false },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      '  src  ': {
        name: 'src',
        parentDirectory: null,
        files: [],
      },
    });
  });

  it('should not create duplicate directory entries', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'src', isDirectory: true, isFile: false },
      { path: 'src', isDirectory: true, isFile: false },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      src: {
        name: 'src',
        parentDirectory: null,
        files: [],
      },
    });
  });

  it('should handle complex nested structure', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'packages', isDirectory: true, isFile: false },
      { path: 'packages/core', isDirectory: true, isFile: false },
      { path: 'packages/core/src', isDirectory: true, isFile: false },
      {
        path: 'packages/core/src/index.ts',
        isDirectory: false,
        isFile: true,
      },
      { path: 'packages/utils', isDirectory: true, isFile: false },
      {
        path: 'packages/utils/helper.ts',
        isDirectory: false,
        isFile: true,
      },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result).toEqual({
      packages: {
        name: 'packages',
        parentDirectory: null,
        files: [],
      },
      'packages/core': {
        name: 'packages/core',
        parentDirectory: 'packages',
        files: [],
      },
      'packages/core/src': {
        name: 'packages/core/src',
        parentDirectory: 'packages/core',
        files: ['packages/core/src/index.ts'],
      },
      'packages/utils': {
        name: 'packages/utils',
        parentDirectory: 'packages',
        files: ['packages/utils/helper.ts'],
      },
    });
  });

  it('should add files to existing directory created by file first', () => {
    const infos: FileSystemPathInfo[] = [
      { path: 'src/index.ts', isDirectory: false, isFile: true },
      { path: 'src/main.ts', isDirectory: false, isFile: true },
    ];

    const result = createFileSystemNodeMap(infos);

    expect(result.src.files).toEqual(['src/index.ts', 'src/main.ts']);
  });
});
