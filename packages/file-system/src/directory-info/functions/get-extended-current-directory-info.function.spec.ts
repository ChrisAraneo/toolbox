import appRootPath from 'app-root-path';

import { getExtendedCurrentDirectoryInfo } from './get-extended-current-directory-info.function';

jest.mock('app-root-path', () => ({
  toString: jest.fn(),
}));

describe('getExtendedCurrentDirectoryInfo', () => {
  let originalCwd: () => string;

  beforeEach(() => {
    originalCwd = process.cwd;
  });

  afterEach(() => {
    process.cwd = originalCwd;
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should return object with all required properties', () => {
      const mockCwd = '/current/working/directory';
      const mockRoot = '/app/root';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result).toHaveProperty('dirname');
      expect(result).toHaveProperty('filename');
      expect(result).toHaveProperty('root');
      expect(result).toHaveProperty('cwd');
    });

    it('should return current working directory from process.cwd()', () => {
      const mockCwd = '/path/to/current/directory';
      const mockRoot = '/app/root';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result.cwd).toBe(mockCwd);
      expect(process.cwd).toHaveBeenCalledTimes(1);
    });

    it('should return root from appRootPath', () => {
      const mockCwd = '/path/to/cwd';
      const mockRoot = '/path/to/app/root';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result.root).toBe(mockRoot);
      expect(appRootPath.toString).toHaveBeenCalledTimes(1);
    });
  });

  describe('dirname and filename', () => {
    it('should include dirname from __dirname', () => {
      const mockCwd = '/path/to/cwd';
      const mockRoot = '/app/root';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result.dirname).toBeDefined();
      expect(typeof result.dirname).toBe('string');
    });

    it('should include filename from __filename', () => {
      const mockCwd = '/path/to/cwd';
      const mockRoot = '/app/root';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result.filename).toBeDefined();
      expect(typeof result.filename).toBe('string');
    });
  });

  describe('path handling', () => {
    it('should handle Windows-style paths', () => {
      const mockCwd = String.raw`C:\Users\username\project`;
      const mockRoot = String.raw`C:\Users\username\app`;

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result.cwd).toBe(mockCwd);
      expect(result.root).toBe(mockRoot);
    });

    it('should handle Unix-style paths', () => {
      const mockCwd = '/home/username/project';
      const mockRoot = '/home/username/app';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result.cwd).toBe(mockCwd);
      expect(result.root).toBe(mockRoot);
    });

    it('should handle root directory paths', () => {
      const mockCwd = '/';
      const mockRoot = '/';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result.cwd).toBe(mockCwd);
      expect(result.root).toBe(mockRoot);
    });
  });

  describe('multiple calls', () => {
    it('should return fresh values on each call', () => {
      const firstCwd = '/first/directory';
      const firstRoot = '/first/root';
      const secondCwd = '/second/directory';
      const secondRoot = '/second/root';

      process.cwd = jest.fn().mockReturnValue(firstCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(firstRoot);
      const firstResult = getExtendedCurrentDirectoryInfo();

      process.cwd = jest.fn().mockReturnValue(secondCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(secondRoot);
      const secondResult = getExtendedCurrentDirectoryInfo();

      expect(firstResult.cwd).toBe(firstCwd);
      expect(firstResult.root).toBe(firstRoot);
      expect(secondResult.cwd).toBe(secondCwd);
      expect(secondResult.root).toBe(secondRoot);
      expect(firstResult.cwd).not.toBe(secondResult.cwd);
      expect(firstResult.root).not.toBe(secondResult.root);
    });

    it('should call process.cwd and appRootPath.toString each time', () => {
      const mockCwd = '/path/to/cwd';
      const mockRoot = '/app/root';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      getExtendedCurrentDirectoryInfo();
      getExtendedCurrentDirectoryInfo();
      getExtendedCurrentDirectoryInfo();

      expect(process.cwd).toHaveBeenCalledTimes(3);
      expect(appRootPath.toString).toHaveBeenCalledTimes(3);
    });
  });

  describe('object structure', () => {
    it('should return object with exactly 4 properties', () => {
      const mockCwd = '/path/to/cwd';
      const mockRoot = '/app/root';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();
      const keys = Object.keys(result);

      expect(keys).toHaveLength(4);
      expect(keys).toContain('dirname');
      expect(keys).toContain('filename');
      expect(keys).toContain('root');
      expect(keys).toContain('cwd');
    });

    it('should return plain object', () => {
      const mockCwd = '/path/to/cwd';
      const mockRoot = '/app/root';

      process.cwd = jest.fn().mockReturnValue(mockCwd);
      (appRootPath.toString as jest.Mock).mockReturnValue(mockRoot);

      const result = getExtendedCurrentDirectoryInfo();

      expect(result).toBeInstanceOf(Object);
      expect(result.constructor).toBe(Object);
    });
  });
});
