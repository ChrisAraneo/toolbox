import { normalizePaths } from './normalize-paths.function';

describe('normalizePaths', () => {
  it('should normalize simple paths without rootDir', () => {
    const normalize = normalizePaths();
    const paths = ['src/file.ts', 'test/file.spec.ts'];

    const result = normalize(paths);

    expect(result).toEqual([
      String.raw`src\file.ts`,
      String.raw`test\file.spec.ts`,
    ]);
  });

  it('should normalize paths with rootDir', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths = ['src/file.ts', 'test/file.spec.ts'];

    const result = normalize(paths);

    expect(result).toEqual([
      String.raw`C:\projects\myapp\src\file.ts`,
      String.raw`C:\projects\myapp\test\file.spec.ts`,
    ]);
  });

  it('should handle empty paths array', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths: string[] = [];

    const result = normalize(paths);

    expect(result).toEqual([]);
  });

  it('should handle single path', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths = ['src/index.ts'];

    const result = normalize(paths);

    expect(result).toEqual([String.raw`C:\projects\myapp\src\index.ts`]);
  });

  it('should normalize paths with mixed separators', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths = [String.raw`src\folder/subfolder\file.ts`];

    const result = normalize(paths);

    expect(result).toEqual([
      String.raw`C:\projects\myapp\src\folder\subfolder\file.ts`,
    ]);
  });

  it('should handle paths with dot segments', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths = ['./src/file.ts', '../other/file.ts'];

    const result = normalize(paths);

    expect(result).toEqual([
      String.raw`C:\projects\myapp\src\file.ts`,
      String.raw`C:\projects\other\file.ts`,
    ]);
  });

  it('should handle rootDir with trailing slash', () => {
    const normalize = normalizePaths('C:\\projects\\myapp\\');
    const paths = ['src/file.ts'];

    const result = normalize(paths);

    expect(result).toEqual([String.raw`C:\projects\myapp\src\file.ts`]);
  });

  it('should handle rootDir with forward slash', () => {
    const normalize = normalizePaths('C:/projects/myapp');
    const paths = ['src/file.ts'];

    const result = normalize(paths);

    expect(result).toEqual([String.raw`C:\projects\myapp\src\file.ts`]);
  });

  it('should handle empty string rootDir', () => {
    const normalize = normalizePaths('');
    const paths = ['src/file.ts', 'test/file.spec.ts'];

    const result = normalize(paths);

    expect(result).toEqual([
      String.raw`src\file.ts`,
      String.raw`test\file.spec.ts`,
    ]);
  });

  it('should handle undefined rootDir', () => {
    const normalize = normalizePaths();
    const paths = ['src/file.ts', 'test/file.spec.ts'];

    const result = normalize(paths);

    expect(result).toEqual([
      String.raw`src\file.ts`,
      String.raw`test\file.spec.ts`,
    ]);
  });

  it('should handle multiple consecutive slashes', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths = ['src//folder///file.ts'];

    const result = normalize(paths);

    expect(result).toEqual([String.raw`C:\projects\myapp\src\folder\file.ts`]);
  });

  it('should preserve file extensions', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths = ['file.ts', 'file.js', 'file.json', 'file.spec.ts'];

    const result = normalize(paths);

    expect(result).toEqual([
      String.raw`C:\projects\myapp\file.ts`,
      String.raw`C:\projects\myapp\file.js`,
      String.raw`C:\projects\myapp\file.json`,
      String.raw`C:\projects\myapp\file.spec.ts`,
    ]);
  });

  it('should handle readonly paths array', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths: readonly string[] = ['src/file.ts', 'test/file.spec.ts'];

    const result = normalize(paths);

    expect(result).toEqual([
      String.raw`C:\projects\myapp\src\file.ts`,
      String.raw`C:\projects\myapp\test\file.spec.ts`,
    ]);
  });

  it('should not mutate the original paths array', () => {
    const normalize = normalizePaths(String.raw`C:\projects\myapp`);
    const paths = ['src/file.ts', 'test/file.spec.ts'];
    const originalPaths = [...paths];

    normalize(paths);

    expect(paths).toEqual(originalPaths);
  });

  it('should handle currying correctly', () => {
    const normalizeWithRoot = normalizePaths(String.raw`C:\projects\myapp`);
    const normalizeWithoutRoot = normalizePaths();

    const paths = ['src/file.ts'];

    const resultWithRoot = normalizeWithRoot(paths);
    const resultWithoutRoot = normalizeWithoutRoot(paths);

    expect(resultWithRoot).toEqual([String.raw`C:\projects\myapp\src\file.ts`]);
    expect(resultWithoutRoot).toEqual([String.raw`src\file.ts`]);
  });
});
