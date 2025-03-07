#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-unused-vars */

import { sortPatternsFile } from './src/sort-patterns-file.function';

process.argv.map(async (value, index) => {
  if (index > 1) {
    try {
      await sortPatternsFile(value);
    } catch (_) {
      console.error('Error: could not read file ' + value);
    }
  }
});
