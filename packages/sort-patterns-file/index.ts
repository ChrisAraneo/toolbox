#!/usr/bin/env node

import { forEach, map } from 'lodash-es';

import { readGitignore } from './src/functions/read-gitignore.function';
import { sortPatternsFile } from './src/sort-patterns-file.function';

const files: string[] = [];

const ignoredDirectories: string[] = [];

let isWriteMode = true;
let isIgnoreMode = false;

forEach(process.argv, (value, index) => {
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
    map(files, async (file) => {
      try {
        await sortPatternsFile(file, ignoredDirectories);
      } catch (error: unknown) {
        console.error(`Error: could not process file ${file}`, error);
      }
    }),
  );
})();
