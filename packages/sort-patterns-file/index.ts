#!/usr/bin/env node

import { sortPatternsFile } from './src/sort-patterns-file.function';

const files: string[] = [];
const ignoredDirectories: string[] = [];

let isWriteMode = true;
let isIgnoreMode = false;

process.argv.map(async (value, index) => {
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

files.forEach(async (file) => {
  try {
    await sortPatternsFile(file, ignoredDirectories);
  } catch {
    console.error(`Error: could not read file ${file}`);
  }
});
