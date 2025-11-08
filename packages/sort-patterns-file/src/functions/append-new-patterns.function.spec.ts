import { appendNewPatterns } from './append-new-patterns.function';

describe('appendNewPatterns', () => {
  it('should append new patterns to the target array', () => {
    const targetArray: string[] = ['pattern1', 'pattern2'];
    const patterns: string[] = ['pattern3', 'pattern4'];

    appendNewPatterns(targetArray, patterns);

    expect(targetArray).toEqual([
      'pattern1',
      'pattern2',
      'pattern3',
      'pattern4',
    ]);
  });

  it('should not append duplicate patterns to the target array', () => {
    const targetArray: string[] = ['pattern1', 'pattern2'];
    const patterns: string[] = ['pattern2', 'pattern3'];

    appendNewPatterns(targetArray, patterns);

    expect(targetArray).toEqual(['pattern1', 'pattern2', 'pattern3']);
  });

  it('should not append empty strings or falsy values', () => {
    const targetArray: string[] = ['pattern1', 'pattern2'];
    const patterns: string[] = ['', 'pattern3', null, 'pattern4'] as string[];

    appendNewPatterns(targetArray, patterns);

    expect(targetArray).toEqual([
      'pattern1',
      'pattern2',
      'pattern3',
      'pattern4',
    ]);
  });

  it('should not modify targetArray if patterns is empty', () => {
    const targetArray: string[] = ['pattern1', 'pattern2'];
    const patterns: string[] = [];

    appendNewPatterns(targetArray, patterns);

    expect(targetArray).toEqual(['pattern1', 'pattern2']);
  });

  it('should handle empty targetArray', () => {
    const targetArray: string[] = [];
    const patterns: string[] = ['pattern1', 'pattern2'];

    appendNewPatterns(targetArray, patterns);

    expect(targetArray).toEqual(['pattern1', 'pattern2']);
  });

  it('should handle empty patterns', () => {
    const targetArray: string[] = ['pattern1', 'pattern2'];
    const patterns: string[] = [];

    appendNewPatterns(targetArray, patterns);

    expect(targetArray).toEqual(['pattern1', 'pattern2']);
  });
});
