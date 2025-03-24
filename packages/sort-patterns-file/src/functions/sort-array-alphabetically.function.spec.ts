import { sortArrayAlphabetically } from './sort-array-alphabetically.function';

describe('sortArrayAlphabetically', () => {
  it('should return empty array when given empty array', () => {
    expect(sortArrayAlphabetically([])).toEqual([]);
  });

  it('should return sorted array of strings', () => {
    expect(sortArrayAlphabetically(['banana', 'apple', 'cherry'])).toEqual([
      'apple',
      'banana',
      'cherry',
    ]);
    expect(sortArrayAlphabetically(['banana', 'Apple', 'cherry'])).toEqual([
      'Apple',
      'banana',
      'cherry',
    ]);
    expect(sortArrayAlphabetically(['banana', 'apple', 'banana'])).toEqual([
      'apple',
      'banana',
      'banana',
    ]);
  });

  it('should not mutate the input array', () => {
    const input = ['banana', 'apple', 'cherry'];

    const result = sortArrayAlphabetically(input);

    expect(input).toEqual(['banana', 'apple', 'cherry']);
    expect(input === result).toBeFalsy();
  });
});
