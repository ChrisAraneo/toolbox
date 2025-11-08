import { getParentDirectory } from './get-parent-directory.function';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('node:fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('node:path');

jest.mock('fs', () => ({
  lstatSync: jest.fn(),
}));

jest.mock('path', () => ({
  dirname: jest.fn(),
  sep: '/',
}));

describe('getParentDirectory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return parent directory of file', () => {
    fs.lstatSync.mockReturnValue({ isFile: () => true });
    path.dirname.mockReturnValue('/users/test');

    const result = getParentDirectory('/users/test/file.txt');

    expect(result).toBe('/users/test');
  });

  it('should return parent directory of directory', () => {
    fs.lstatSync.mockReturnValue({ isFile: () => false });
    path.dirname.mockReturnValue('/users/test/folder');

    const result = getParentDirectory('/users/test/folder');

    expect(result).toBe('/users/test');
  });

  it('should return current directory when path is the root directory', () => {
    fs.lstatSync.mockReturnValue({ isFile: () => false });
    path.dirname.mockReturnValue('/');

    const result = getParentDirectory('/');

    expect(result).toBe('.');
  });

  it('should return root directory when dirname is empty', () => {
    fs.lstatSync.mockReturnValue({ isFile: () => true });
    path.dirname.mockReturnValue('');

    const result = getParentDirectory('');

    expect(result).toBe('.');
  });
});
