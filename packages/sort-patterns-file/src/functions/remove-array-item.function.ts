export function removeArrayItem(array: string[], item: string): void { // TODO Remove
  const index = array.findIndex((i) => i === item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}
