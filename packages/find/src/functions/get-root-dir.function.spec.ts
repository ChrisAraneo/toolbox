import { getRootDir } from './get-root-dir.function';

describe('getRootDir', () => {
  it('should return undefined when options is undefined', () => {
    const result = getRootDir();

    expect(result).toBeUndefined();
  });

  it('should return undefined when options is empty object', () => {
    const result = getRootDir({});

    expect(result).toBeUndefined();
  });

  it('should return root when root is provided', () => {
    const options = { root: String.raw`C:\projects\myapp` };

    const result = getRootDir(options);

    expect(result).toBe(String.raw`C:\projects\myapp`);
  });

  it('should return cwd when cwd is provided and root is not', () => {
    const options = { cwd: String.raw`C:\projects\otherapp` };

    const result = getRootDir(options);

    expect(result).toBe(String.raw`C:\projects\otherapp`);
  });

  it('should prefer root over cwd when both are provided', () => {
    const options = {
      root: String.raw`C:\projects\myapp`,
      cwd: String.raw`C:\projects\otherapp`,
    };

    const result = getRootDir(options);

    expect(result).toBe(String.raw`C:\projects\myapp`);
  });

  it('should handle empty strings for root', () => {
    const options = { root: '' };

    const result = getRootDir(options);

    expect(result).toBe('');
  });

  it('should handle empty strings for cwd', () => {
    const options = { cwd: '' };

    const result = getRootDir(options);

    expect(result).toBe('');
  });

  it('should return root when root is empty string and cwd is provided', () => {
    const options = { root: '', cwd: String.raw`C:\projects\otherapp` };

    const result = getRootDir(options);

    expect(result).toBe('');
  });
});
