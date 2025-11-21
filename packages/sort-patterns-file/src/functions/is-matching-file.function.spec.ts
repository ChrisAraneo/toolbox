import { isMatchingFile } from './is-matching-file.function';

describe('isMatchingFile', () => {
  it('should return false when files array is empty', () => {
    const pattern = '*.ts';
    const files: string[] = [];

    expect(isMatchingFile(pattern, files)).toBe(false);
  });

  it('should return true when a file matches the pattern', () => {
    const pattern = '*.ts';
    const files = ['index.ts', 'main.js', 'test.ts'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should return false when no files match the pattern', () => {
    const pattern = '*.ts';
    const files = ['index.js', 'main.css', 'test.html'];

    expect(isMatchingFile(pattern, files)).toBe(false);
  });

  it('should return true when first file matches the pattern', () => {
    const pattern = '*.ts';
    const files = ['index.ts', 'main.js', 'test.css'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should return true when last file matches the pattern', () => {
    const pattern = '*.ts';
    const files = ['index.js', 'main.css', 'test.ts'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should handle complex glob patterns', () => {
    const pattern = 'src/**/*.ts';
    const files = ['src/index.ts', 'src/utils/helper.ts', 'test/main.js'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should return false when complex glob pattern does not match', () => {
    const pattern = 'src/**/*.ts';
    const files = ['test/index.ts', 'main.js', 'lib/helper.js'];

    expect(isMatchingFile(pattern, files)).toBe(false);
  });

  it('should handle exact file name patterns', () => {
    const pattern = 'package.json';
    const files = ['package.json', 'package-lock.json', 'tsconfig.json'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should handle negation patterns', () => {
    const pattern = '!*.test.ts';
    const files = ['index.ts', 'main.ts', 'utils.ts'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should handle multiple wildcards in pattern', () => {
    const pattern = '**/*.spec.ts';
    const files = ['src/utils/helper.spec.ts', 'src/index.ts', 'main.js'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should return true when multiple files match the pattern', () => {
    const pattern = '*.ts';
    const files = ['index.ts', 'main.ts', 'test.ts'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should handle patterns with specific directories', () => {
    const pattern = 'src/*.ts';
    const files = ['src/index.ts', 'lib/main.ts', 'test/helper.ts'];

    expect(isMatchingFile(pattern, files)).toBe(true);
  });

  it('should return false when pattern with specific directory does not match', () => {
    const pattern = 'src/*.ts';
    const files = ['lib/index.ts', 'test/main.ts', 'dist/helper.ts'];

    expect(isMatchingFile(pattern, files)).toBe(false);
  });
});
