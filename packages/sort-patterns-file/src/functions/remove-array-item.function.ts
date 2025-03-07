export function removeArrayItem(array: string[], item: string): void {
  array.splice(
    array.findIndex((i) => i === item),
    1,
  );
}
