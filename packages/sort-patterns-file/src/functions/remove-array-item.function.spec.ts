import { removeArrayItem } from './remove-array-item.function';

describe('removeArrayItem', () => {
  let array: string[];

  beforeEach(() => {
    array = ['apple', 'banana', 'cherry'];
  });

  it('should remove an item from the array', () => {
    removeArrayItem(array, 'banana');

    expect(array).toEqual(['apple', 'cherry']);
  });

  it('should not modify the array if the item is not found', () => {
    removeArrayItem(array, 'orange');

    expect(array).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should remove the first occurrence of the item', () => {
    array.push('banana');

    removeArrayItem(array, 'banana');

    expect(array).toEqual(['apple', 'cherry', 'banana']);
  });

  it('should remove an item when it is the only element in the array', () => {
    array = ['banana'];

    removeArrayItem(array, 'banana');

    expect(array).toEqual([]);
  });

  it('should do nothing when the array is empty', () => {
    array = [];

    removeArrayItem(array, 'banana');

    expect(array).toEqual([]);
  });

  it('should not mutate the array if item is not found', () => {
    const originalArray = [...array];

    removeArrayItem(array, 'orange');

    expect(array).toEqual(originalArray);
  });
});
