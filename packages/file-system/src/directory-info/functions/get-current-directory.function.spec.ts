import { getCurrentDirectory } from './get-current-directory.function';

describe('getCurrentDirectory', () => {
  let originalCwd: () => string;

  beforeEach(() => {
    originalCwd = process.cwd;
  });

  afterEach(() => {
    process.cwd = originalCwd;
  });

  it('should return the current working directory', () => {
    const mockDirectory = '/path/to/current/directory';
    process.cwd = jest.fn().mockReturnValue(mockDirectory);

    const result = getCurrentDirectory();

    expect(result).toBe(mockDirectory);
    expect(process.cwd).toHaveBeenCalledTimes(1);
  });

  it('should return different directory when process.cwd changes', () => {
    const firstDirectory = '/first/directory';
    const secondDirectory = '/second/directory';

    process.cwd = jest.fn().mockReturnValue(firstDirectory);
    const firstResult = getCurrentDirectory();

    process.cwd = jest.fn().mockReturnValue(secondDirectory);
    const secondResult = getCurrentDirectory();

    expect(firstResult).toBe(firstDirectory);
    expect(secondResult).toBe(secondDirectory);
    expect(firstResult).not.toBe(secondResult);
  });

  it('should handle Windows-style paths', () => {
    const windowsPath = String.raw`C:\Users\username\project`;
    process.cwd = jest.fn().mockReturnValue(windowsPath);

    const result = getCurrentDirectory();

    expect(result).toBe(windowsPath);
  });

  it('should handle Unix-style paths', () => {
    const unixPath = '/home/username/project';
    process.cwd = jest.fn().mockReturnValue(unixPath);

    const result = getCurrentDirectory();

    expect(result).toBe(unixPath);
  });

  it('should handle root directory', () => {
    const rootPath = '/';
    process.cwd = jest.fn().mockReturnValue(rootPath);

    const result = getCurrentDirectory();

    expect(result).toBe(rootPath);
  });
});
