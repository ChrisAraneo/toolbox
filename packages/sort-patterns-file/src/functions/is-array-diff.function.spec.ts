import { isArrayDiff } from './is-array-diff.function';

describe('isArrayDiff', () => {
  it('should return true when arrays have different lengths', () => {
    const a = ['apple', 'banana'];
    const b = ['apple'];

    expect(isArrayDiff(a, b)).toBe(true);
  });

  it('should return false when arrays have the equal length and elements', () => {
    const a = ['apple', 'banana'];
    const b = ['apple', 'banana'];

    expect(isArrayDiff(a, b)).toBe(false);
  });

  it('should return true when arrays have the equal length but different elements', () => {
    const a = ['apple', 'banana'];
    const b = ['apple', 'cherry'];

    expect(isArrayDiff(a, b)).toBe(true);
  });

  it('should return true when arrays have equal length but different order of elements', () => {
    const a = ['apple', 'banana'];
    const b = ['banana', 'apple'];

    expect(isArrayDiff(a, b)).toBe(true);
  });

  it('should return false when arrays are empty', () => {
    const a: string[] = [];
    const b: string[] = [];

    expect(isArrayDiff(a, b)).toBe(false);
  });

  it('should return true when one array is empty and the other is not', () => {
    const a: string[] = [];
    const b = ['apple'];

    expect(isArrayDiff(a, b)).toBe(true);
  });
});
