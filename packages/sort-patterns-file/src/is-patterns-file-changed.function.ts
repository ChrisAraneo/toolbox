export function isPatternsFileChanged(a: string[], b: string[]): boolean {
  let changed = false;

  a.forEach((value, index) => {
    if (b.length <= index || value !== b[index]) {
      changed = true;

      return;
    }
  });

  return changed;
}
