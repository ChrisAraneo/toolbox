import { FileSystemNode } from '../interfaces/file-system-node.interface';

import { createOrganizedFileSystemNodeArray } from './create-organized-file-system-node-array.function';
import { getSortedKeys } from './get-sorted-keys.function';

jest.mock('./get-sorted-keys.function');

describe('createOrganizedFileSystemNodeArray', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return organized array with root directory at the end', () => {
    const directories: Record<string, FileSystemNode> = {
      '.': { name: '.', parentDirectory: null, files: ['package.json'] },
      src: { name: 'src', parentDirectory: '.', files: ['index.ts', 'app.ts'] },
    };

    (getSortedKeys as jest.Mock).mockReturnValue(['.', 'src']);

    const result = createOrganizedFileSystemNodeArray(directories);

    expect(result).toEqual([
      {
        name: 'src',
        parentDirectory: '.',
        files: ['app.ts', 'index.ts'],
      },
      {
        name: '.',
        parentDirectory: null,
        files: ['package.json'],
      },
    ]);
  });

  it('should filter out root directory from sorted keys', () => {
    const directories: Record<string, FileSystemNode> = {
      '.': { name: '.', parentDirectory: null, files: [] },
      lib: { name: 'lib', parentDirectory: '.', files: [] },
      src: { name: 'src', parentDirectory: '.', files: [] },
    };

    (getSortedKeys as jest.Mock).mockReturnValue(['.', 'lib', 'src']);

    const result = createOrganizedFileSystemNodeArray(directories);

    expect(result).toEqual([
      {
        name: 'lib',
        parentDirectory: '.',
        files: [],
      },
      {
        name: 'src',
        parentDirectory: '.',
        files: [],
      },
      {
        name: '.',
        parentDirectory: null,
        files: [],
      },
    ]);
  });

  it('should sort files alphabetically within each directory', () => {
    const directories: Record<string, FileSystemNode> = {
      '.': { name: '.', parentDirectory: null, files: [] },
      src: {
        name: 'src',
        parentDirectory: '.',
        files: ['zebra.ts', 'apple.ts', 'middle.ts'],
      },
    };

    (getSortedKeys as jest.Mock).mockReturnValue(['.', 'src']);

    const result = createOrganizedFileSystemNodeArray(directories);

    expect(result[0].files).toEqual(['apple.ts', 'middle.ts', 'zebra.ts']);
  });

  it('should trim whitespace from directory names and file names', () => {
    const directories: Record<string, FileSystemNode> = {
      '.': { name: '.', parentDirectory: null, files: [] },
      'src ': {
        name: 'src ',
        parentDirectory: '. ',
        files: [' index.ts ', ' app.ts '],
      },
    };

    (getSortedKeys as jest.Mock).mockReturnValue(['.', 'src ']);

    const result = createOrganizedFileSystemNodeArray(directories);

    expect(result).toEqual([
      {
        name: 'src',
        parentDirectory: '.',
        files: ['app.ts', 'index.ts'],
      },
      {
        name: '.',
        parentDirectory: null,
        files: [],
      },
    ]);
  });

  it('should handle directories with null parentDirectory', () => {
    const directories: Record<string, FileSystemNode> = {
      '.': { name: '.', parentDirectory: null, files: [] },
      src: { name: 'src', parentDirectory: null, files: ['index.ts'] },
    };

    (getSortedKeys as jest.Mock).mockReturnValue(['.', 'src']);

    const result = createOrganizedFileSystemNodeArray(directories);

    expect(result[0].parentDirectory).toBeNull();
  });

  it('should handle only root directory', () => {
    const directories: Record<string, FileSystemNode> = {
      '.': { name: '.', parentDirectory: null, files: ['index.ts'] },
    };

    (getSortedKeys as jest.Mock).mockReturnValue(['.']);

    const result = createOrganizedFileSystemNodeArray(directories);

    expect(result).toEqual([
      {
        name: '.',
        parentDirectory: null,
        files: ['index.ts'],
      },
    ]);
  });

  it('should handle multiple directories at different levels', () => {
    const directories: Record<string, FileSystemNode> = {
      '.': { name: '.', parentDirectory: null, files: ['readme.md'] },
      src: { name: 'src', parentDirectory: '.', files: ['main.ts'] },
      'src/utils': {
        name: 'src/utils',
        parentDirectory: 'src',
        files: ['helper.ts'],
      },
      lib: { name: 'lib', parentDirectory: '.', files: ['lib.ts'] },
    };

    (getSortedKeys as jest.Mock).mockReturnValue([
      '.',
      'lib',
      'src',
      'src/utils',
    ]);

    const result = createOrganizedFileSystemNodeArray(directories);

    expect(result).toEqual([
      {
        name: 'lib',
        parentDirectory: '.',
        files: ['lib.ts'],
      },
      {
        name: 'src',
        parentDirectory: '.',
        files: ['main.ts'],
      },
      {
        name: 'src/utils',
        parentDirectory: 'src',
        files: ['helper.ts'],
      },
      {
        name: '.',
        parentDirectory: null,
        files: ['readme.md'],
      },
    ]);
  });

  it('should handle empty files array', () => {
    const directories: Record<string, FileSystemNode> = {
      '.': { name: '.', parentDirectory: null, files: [] },
      src: { name: 'src', parentDirectory: '.', files: [] },
    };

    (getSortedKeys as jest.Mock).mockReturnValue(['.', 'src']);

    const result = createOrganizedFileSystemNodeArray(directories);

    expect(result[0].files).toEqual([]);
    expect(result[1].files).toEqual([]);
  });
});
