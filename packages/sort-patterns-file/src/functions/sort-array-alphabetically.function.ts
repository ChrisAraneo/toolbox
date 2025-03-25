export function sortArrayAlphabetically(array: string[]): void {
  array.sort((a: string, b: string) => a.localeCompare(b));
}
