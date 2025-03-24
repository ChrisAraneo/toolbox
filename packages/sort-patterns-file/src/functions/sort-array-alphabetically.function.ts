export function sortArrayAlphabetically(array: string[]): string[] {
  return [...array].sort((a: string, b: string) => a.localeCompare(b));
}
