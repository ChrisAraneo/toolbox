export function isPatternsFileChanged(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return true;
  }

  let changed = false;

  for (let i = 0; i < a.length && !changed; i++) {
    if (a[i] !== b[i]) {
      changed = true;
    }
  }

  return changed;
}
