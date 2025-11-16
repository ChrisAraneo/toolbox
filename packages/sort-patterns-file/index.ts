#!/usr/bin/env node

import { sortPatternsFile } from './src/sort-patterns-file.function';

// eslint-disable-next-line @typescript-eslint/naming-convention
const files: string[] = [];

// eslint-disable-next-line @typescript-eslint/naming-convention
const ignoredDirectories: string[] = [];

let isWriteMode = true;
let isIgnoreMode = false;

process.argv.forEach((value, index) => {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  if (index <= 1) {
    return;
  }

  if (value === '-i' || value === '--ignore') {
    isIgnoreMode = true;
    isWriteMode = false;

    return;
  }

  if (value === '-w' || value === '--write') {
    isIgnoreMode = false;
    isWriteMode = true;

    return;
  }

  if (isIgnoreMode) {
    ignoredDirectories.push(value.trim());
  } else if (isWriteMode) {
    files.push(value.trim());
  }
});

void Promise.all(
  files.map(async (file) => {
    try {
      await sortPatternsFile(file, ignoredDirectories);
    } catch {
      // eslint-disable-next-line no-console
      console.error(`Error: could not read file ${file}`);
    }
  }),
);
