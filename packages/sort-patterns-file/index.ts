#!/usr/bin/env node

import { readGitignore } from './src/functions/read-gitignore.function';
import { sortPatternsFile } from './src/sort-patterns-file.function';

const files: string[] = [];

const ignoredDirectories: string[] = [];

let isWriteMode = true;
let isIgnoreMode = false;

process.argv.forEach((value, index) => {
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

void (async () => {
  ignoredDirectories.push(...(await readGitignore()));

  await Promise.all(
    files.map(async (file) => {
      try {
        await sortPatternsFile(file, ignoredDirectories);
      } catch (error: unknown) {
        console.error(`Error: could not process file ${file}`, error);
      }
    }),
  );
})();
