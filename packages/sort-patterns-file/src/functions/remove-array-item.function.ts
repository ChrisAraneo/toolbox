export function removeArrayItem(array: string[], item: string): void {
  const index = array.findIndex((i) => i === item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}
