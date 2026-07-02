import { ExtendedFileSystemNode } from '../interfaces/extended-file-system-node.interface';

import { sortByMatchingDirectories } from './sort-by-matching-directories.function';

describe('sortByMatchingDirectories', () => {
  it('should sort matchingDirectories alphabetically', () => {
    const node: ExtendedFileSystemNode = {
      name: 'src',
      parentDirectory: null,
      files: [],
      matchingDirectories: ['node_modules', 'dist', 'coverage'],
      matchingFiles: [],
    };

    sortByMatchingDirectories(node);

    expect(node.matchingDirectories).toEqual([
      'coverage',
      'dist',
      'node_modules',
    ]);
  });

  it('should handle empty matchingDirectories array', () => {
    const node: ExtendedFileSystemNode = {
      name: 'src',
      parentDirectory: null,
      files: [],
      matchingDirectories: [],
      matchingFiles: [],
    };

    sortByMatchingDirectories(node);

    expect(node.matchingDirectories).toEqual([]);
  });

  it('should handle single item in matchingDirectories', () => {
    const node: ExtendedFileSystemNode = {
      name: 'src',
      parentDirectory: null,
      files: [],
      matchingDirectories: ['dist'],
      matchingFiles: [],
    };

    sortByMatchingDirectories(node);

    expect(node.matchingDirectories).toEqual(['dist']);
  });

  it('should handle duplicate directory names', () => {
    const node: ExtendedFileSystemNode = {
      name: 'root',
      parentDirectory: null,
      files: [],
      matchingDirectories: ['dist', 'coverage', 'dist'],
      matchingFiles: [],
    };

    sortByMatchingDirectories(node);

    expect(node.matchingDirectories).toEqual(['coverage', 'dist', 'dist']);
  });

  it('should mutate the matchingDirectories array', () => {
    const node: ExtendedFileSystemNode = {
      name: 'root',
      parentDirectory: null,
      files: [],
      matchingDirectories: ['node_modules', 'dist', 'coverage'],
      matchingFiles: [],
    };
    const original = [...node.matchingDirectories];

    sortByMatchingDirectories(node);

    expect(node.matchingDirectories).toEqual([
      'coverage',
      'dist',
      'node_modules',
    ]);
    expect(node.matchingDirectories).not.toEqual(original);
  });

  it('should not affect matchingFiles array', () => {
    const node: ExtendedFileSystemNode = {
      name: 'root',
      parentDirectory: null,
      files: [],
      matchingDirectories: ['node_modules', 'dist'],
      matchingFiles: ['index.ts', 'app.ts'],
    };

    sortByMatchingDirectories(node);

    expect(node.matchingFiles).toEqual(['index.ts', 'app.ts']);
  });

  it('should not affect files array', () => {
    const node: ExtendedFileSystemNode = {
      name: 'root',
      parentDirectory: null,
      files: ['test.ts', 'main.ts'],
      matchingDirectories: ['node_modules', 'dist'],
      matchingFiles: [],
    };

    sortByMatchingDirectories(node);

    expect(node.files).toEqual(['test.ts', 'main.ts']);
  });
});
