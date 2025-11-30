import fs from 'node:fs';
import path from 'node:path';

import { getParentDirectory } from './get-parent-directory.function';

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
    (fs.lstatSync as any).mockReturnValue({ isFile: () => true });
    (path.dirname as any).mockReturnValue('/users/test');

    const result = getParentDirectory('/users/test/file.txt');

    expect(result).toBe('/users/test');
  });

  it('should return parent directory of directory', () => {
    (fs.lstatSync as any).mockReturnValue({ isFile: () => false });
    (path.dirname as any).mockReturnValue('/users/test/folder');

    const result = getParentDirectory('/users/test/folder');

    expect(result).toBe('/users/test');
  });

  it('should return current directory when path is the root directory', () => {
    (fs.lstatSync as any).mockReturnValue({ isFile: () => false });
    (path.dirname as any).mockReturnValue('/');

    const result = getParentDirectory('/');

    expect(result).toBe('.');
  });

  it('should return root directory when dirname is empty', () => {
    (fs.lstatSync as any).mockReturnValue({ isFile: () => true });
    (path.dirname as any).mockReturnValue('');

    const result = getParentDirectory('');

    expect(result).toBe('.');
  });

  it('should trim whitespace from parent directory path', () => {
    (fs.lstatSync as any).mockReturnValue({ isFile: () => false });
    (path.dirname as any).mockReturnValue('     /users/test/folder  ');

    const result = getParentDirectory('/users/test/folder');

    expect(result).toBe('/users/test');
    expect(result).not.toContain(' ');
  });
});
