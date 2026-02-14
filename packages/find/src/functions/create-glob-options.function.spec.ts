import { createGlobOptions } from './create-glob-options.function';

describe('createGlobOptions', () => {
  it('should return default options when options is undefined', () => {
    const result = createGlobOptions(undefined);

    expect(result).toEqual({
      cwd: undefined,
      ignore: undefined,
      dot: false,
      absolute: false,
    });
  });

  it('should return default options when options is empty object', () => {
    const result = createGlobOptions({});

    expect(result).toEqual({
      cwd: undefined,
      ignore: undefined,
      dot: false,
      absolute: false,
    });
  });

  it('should use root as cwd when root is provided', () => {
    const options = { root: 'C:\\projects\\myapp' };

    const result = createGlobOptions(options);

    expect(result).toEqual({
      cwd: 'C:\\projects\\myapp',
      ignore: undefined,
      dot: false,
      absolute: false,
    });
  });

  it('should use cwd when cwd is provided and root is not', () => {
    const options = { cwd: 'C:\\projects\\otherapp' };

    const result = createGlobOptions(options);

    expect(result).toEqual({
      cwd: 'C:\\projects\\otherapp',
      ignore: undefined,
      dot: false,
      absolute: false,
    });
  });

  it('should prefer root over cwd when both are provided', () => {
    const options = {
      root: 'C:\\projects\\myapp',
      cwd: 'C:\\projects\\otherapp',
    };

    const result = createGlobOptions(options);

    expect(result).toEqual({
      cwd: 'C:\\projects\\myapp',
      ignore: undefined,
      dot: false,
      absolute: false,
    });
  });

  it('should copy ignore patterns when provided', () => {
    const options = { ignore: ['node_modules/**', 'dist/**'] };

    const result = createGlobOptions(options);

    expect(result).toEqual({
      cwd: undefined,
      ignore: ['node_modules/**', 'dist/**'],
      dot: false,
      absolute: false,
    });
  });

  it('should create a new array for ignore patterns to avoid mutation', () => {
    const ignorePatterns = ['node_modules/**', 'dist/**'];
    const options = { ignore: ignorePatterns };

    const result = createGlobOptions(options);

    expect(result.ignore).toEqual(ignorePatterns);
    expect(result.ignore).not.toBe(ignorePatterns);
  });

  it('should set dot to true when dot is true', () => {
    const options = { dot: true };

    const result = createGlobOptions(options);

    expect(result).toEqual({
      cwd: undefined,
      ignore: undefined,
      dot: true,
      absolute: false,
    });
  });

  it('should set dot to false when dot is false', () => {
    const options = { dot: false };

    const result = createGlobOptions(options);

    expect(result).toEqual({
      cwd: undefined,
      ignore: undefined,
      dot: false,
      absolute: false,
    });
  });

  it('should handle all options together', () => {
    const options = {
      root: 'C:\\projects\\myapp',
      ignore: ['node_modules/**', '*.log'],
      dot: true,
    };

    const result = createGlobOptions(options);

    expect(result).toEqual({
      cwd: 'C:\\projects\\myapp',
      ignore: ['node_modules/**', '*.log'],
      dot: true,
      absolute: false,
    });
  });

  it('should always set absolute to false', () => {
    const options = {
      root: 'C:\\projects\\myapp',
      dot: true,
    };

    const result = createGlobOptions(options);

    expect(result.absolute).toBe(false);
  });

  it('should handle empty ignore array', () => {
    const options = { ignore: [] };

    const result = createGlobOptions(options);

    expect(result).toEqual({
      cwd: undefined,
      ignore: [],
      dot: false,
      absolute: false,
    });
  });
});
