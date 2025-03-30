import { isPatternsFileChanged } from './is-patterns-file-changed.function';

describe('isPatternsFileChanged', () => {
  let a: string[] = [];
  let b: string[] = [];

  it('should return true if arrays have different lengths', () => {
    a = ['apple', 'banana'];
    b = ['apple'];

    expect(isPatternsFileChanged(a, b)).toBe(true);

    a = [];
    b = ['apple'];

    expect(isPatternsFileChanged(a, b)).toBe(true);

    a = ['banana'];
    b = [];

    expect(isPatternsFileChanged(a, b)).toBe(true);
  });

  it('should return false if arrays are the same length and contain the same elements', () => {
    a = ['apple', 'banana', 'cherry'];
    b = ['apple', 'banana', 'cherry'];

    expect(isPatternsFileChanged(a, b)).toBe(false);
  });

  it('should return true if arrays are the same length and contain different elements', () => {
    a = ['apple', 'banana', 'cherry'];
    b = ['apple', 'orange', 'cherry'];

    expect(isPatternsFileChanged(a, b)).toBe(true);

    a = ['apple', 'banana'];
    b = ['orange', 'banana'];

    expect(isPatternsFileChanged(a, b)).toBe(true);

    a = ['apple', 'banana'];
    b = ['apple', 'orange'];

    expect(isPatternsFileChanged(a, b)).toBe(true);
  });

  it('should return false if both arrays are empty', () => {
    a = [];
    b = [];

    expect(isPatternsFileChanged(a, b)).toBe(false);
  });
});
