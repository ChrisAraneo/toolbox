import { ExtendedFileSystemNode } from '../interfaces/extended-file-system-node.interface';
import { sortByMatchingFiles } from './sort-by-matching-files.function';

describe('sortByMatchingFiles', () => {
  it('should sort matchingFiles alphabetically', () => {
    const node: ExtendedFileSystemNode = {
      name: 'src',
      parentDirectory: null,
      files: [],
      matchingDirectories: [],
      matchingFiles: ['index.ts', 'app.ts', 'config.ts'],
    };

    sortByMatchingFiles(node);

    expect(node.matchingFiles).toEqual(['app.ts', 'config.ts', 'index.ts']);
  });

  it('should handle empty matchingFiles array', () => {
    const node: ExtendedFileSystemNode = {
      name: 'src',
      parentDirectory: null,
      files: [],
      matchingDirectories: [],
      matchingFiles: [],
    };

    sortByMatchingFiles(node);

    expect(node.matchingFiles).toEqual([]);
  });

  it('should handle single item in matchingFiles', () => {
    const node: ExtendedFileSystemNode = {
      name: 'src',
      parentDirectory: null,
      files: [],
      matchingDirectories: [],
      matchingFiles: ['index.ts'],
    };

    sortByMatchingFiles(node);

    expect(node.matchingFiles).toEqual(['index.ts']);
  });

  it('should handle duplicate file names', () => {
    const node: ExtendedFileSystemNode = {
      name: 'root',
      parentDirectory: null,
      files: [],
      matchingDirectories: [],
      matchingFiles: ['index.ts', 'app.ts', 'index.ts'],
    };

    sortByMatchingFiles(node);

    expect(node.matchingFiles).toEqual(['app.ts', 'index.ts', 'index.ts']);
  });

  it('should mutate the matchingFiles array', () => {
    const node: ExtendedFileSystemNode = {
      name: 'root',
      parentDirectory: null,
      files: [],
      matchingDirectories: [],
      matchingFiles: ['index.ts', 'app.ts', 'config.ts'],
    };
    const original = [...node.matchingFiles];

    sortByMatchingFiles(node);

    expect(node.matchingFiles).toEqual(['app.ts', 'config.ts', 'index.ts']);
    expect(node.matchingFiles).not.toEqual(original);
  });

  it('should not affect matchingDirectories array', () => {
    const node: ExtendedFileSystemNode = {
      name: 'root',
      parentDirectory: null,
      files: [],
      matchingDirectories: ['node_modules', 'dist'],
      matchingFiles: ['index.ts', 'app.ts'],
    };

    sortByMatchingFiles(node);

    expect(node.matchingDirectories).toEqual(['node_modules', 'dist']);
  });

  it('should not affect files array', () => {
    const node: ExtendedFileSystemNode = {
      name: 'root',
      parentDirectory: null,
      files: ['test.ts', 'main.ts'],
      matchingDirectories: [],
      matchingFiles: ['index.ts', 'app.ts'],
    };

    sortByMatchingFiles(node);

    expect(node.files).toEqual(['test.ts', 'main.ts']);
  });
});
