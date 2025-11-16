/* eslint-disable @typescript-eslint/naming-convention */

import { getSortedKeys } from './get-sorted-keys.function';

describe('getSortedKeys', () => {
  it('should return empty array when given an empty object', () => {
    const input = {};

    const result = getSortedKeys(input);

    expect(result).toEqual([]);
  });

  it('should return sorted array of keys alphabetically', () => {
    const input = {
      banana: 'value1',
      apple: 'value2',
      cherry: 'value3',
    };

    const result = getSortedKeys(input);

    expect(result).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should sort keys case-sensitively with uppercase first', () => {
    const input = {
      banana: 'value1',
      Apple: 'value2',
      cherry: 'value3',
    };

    const result = getSortedKeys(input);

    expect(result).toEqual(['Apple', 'banana', 'cherry']);
  });

  it('should handle objects with numeric string keys', () => {
    const input = {
      '3': 'value3',
      '1': 'value1',
      '2': 'value2',
    };

    const result = getSortedKeys(input);

    expect(result).toEqual(['1', '2', '3']);
  });

  it('should handle objects with special characters in keys', () => {
    const input = {
      'key-3': 'value3',
      'key-1': 'value1',
      'key_2': 'value2',
    };

    const result = getSortedKeys(input);

    expect(result).toEqual(['key_2', 'key-1', 'key-3']);
  });

  it('should handle objects with single key', () => {
    const input = {
      onlyKey: 'value',
    };

    const result = getSortedKeys(input);

    expect(result).toEqual(['onlyKey']);
  });

  it('should handle objects with dot notation keys', () => {
    const input = {
      '.git': 'value1',
      'package.json': 'value2',
      '.gitignore': 'value3',
      'README.md': 'value4',
    };

    const result = getSortedKeys(input);

    expect(result).toEqual(['.git', '.gitignore', 'package.json', 'README.md']);
  });

  it('should sort path-like keys correctly', () => {
    const input = {
      'src/utils': {},
      'src/components': {},
      '.': {},
      src: {},
    };

    const result = getSortedKeys(input);

    expect(result).toEqual(['.', 'src', 'src/components', 'src/utils']);
  });
});
