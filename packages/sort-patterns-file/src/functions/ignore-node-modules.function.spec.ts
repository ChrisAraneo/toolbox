import { ignoreNodeModules } from './ignore-node-modules.function';

describe('ignoreNodeModules', () => {
  it('should return an empty array when no patterns are provided', () => {
    const result = ignoreNodeModules([]);

    expect(result).toEqual([]);
  });

  it('should return the same array when "node_modules" is not present', () => {
    const patterns = ['src', 'dist', 'assets'];

    const result = ignoreNodeModules(patterns);

    expect(result).toEqual(patterns);
  });

  it('should remove multiple "node_modules" from the array', () => {
    const patterns = ['node_modules', 'src', 'node_modules', 'dist'];

    const result = ignoreNodeModules(patterns);

    expect(result).toEqual(['src', 'dist']);
  });

  it('should return an empty array when "node_modules" is the only element', () => {
    const patterns = ['node_modules'];

    const result = ignoreNodeModules(patterns);

    expect(result).toEqual([]);
  });

  it('should not modify the input array', () => {
    const patterns = ['src', 'node_modules', 'dist'];

    const result = ignoreNodeModules(patterns);

    expect(result).toEqual(['src', 'dist']);
    expect(patterns).toEqual(['src', 'node_modules', 'dist']);
  });
});
