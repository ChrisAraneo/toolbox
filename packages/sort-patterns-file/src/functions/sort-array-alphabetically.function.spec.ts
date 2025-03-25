import { sortArrayAlphabetically } from './sort-array-alphabetically.function';

describe('sortArrayAlphabetically', () => {
  it('should return empty array when given an empty array', () => {
    const input: string[] = [];
    sortArrayAlphabetically(input);
    expect(input).toEqual([]);
  });

  it('should return sorted array of strings', () => {
    const input1: string[] = ['banana', 'apple', 'cherry'];
    sortArrayAlphabetically(input1);
    expect(input1).toEqual(['apple', 'banana', 'cherry']);

    const input2: string[] = ['banana', 'Apple', 'cherry'];
    sortArrayAlphabetically(input2);
    expect(input2).toEqual(['Apple', 'banana', 'cherry']);

    const input3: string[] = ['banana', 'apple', 'banana'];
    sortArrayAlphabetically(input3);
    expect(input3).toEqual(['apple', 'banana', 'banana']);
  });

  it('should mutate the input array', () => {
    const input: string[] = ['banana', 'apple', 'cherry'];
    const originalInput: string[] = [...input];

    sortArrayAlphabetically(input);

    expect(input).toEqual(['apple', 'banana', 'cherry']);
    expect(input).not.toEqual(originalInput);
  });
});
