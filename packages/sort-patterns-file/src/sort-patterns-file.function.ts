import { readFile as _readFile } from 'node:fs/promises';
import { normalize } from 'node:path';
import process from 'node:process';

import { minimatch } from 'minimatch';

import { CurrentDirectory, FileFinder } from '../../file-system';

export async function sortPatternsFile() {
  const currentDirectoryFiles = await getCurrentDirectoryFiles();
  const patternFiles = await getPatternFiles();

  console.log('patternFiles', patternFiles);

  patternFiles.map(async ([path, data]) => {
    if (!data) {
      throw Error(`Can't read ${path}`);
    }

    const patterns = await readPatternFile(path);

    sortPatterns(patterns, currentDirectoryFiles).forEach((x) => {
      console.log(JSON.stringify(x));
    });
  });
}

async function getCurrentDirectoryFiles() {
  const ALL_FILES_REGEX = /^(?=[\S\s]{10,8000})[\S\s]*$/;

  const fileFinder = new FileFinder();
  const currentDirectory = new CurrentDirectory();

  return new Promise<string[]>((resolve) => {
    fileFinder
      .findFile(ALL_FILES_REGEX, currentDirectory.getCurrentDirectory())
      .subscribe(({ success, result, message }) => {
        if (!success) {
          if (typeof message === 'string') {
            throw new Error(message);
          } else {
            throw message;
          }
        }

        resolve(result);
      });
  });
}

function sortPatterns(
  patterns: string[],
  files: string[],
): [string, string[]][] {
  const fileMatches: [string, string[]][] = [];

  files.forEach((file) => {
    const matchingPatterns: string[] = [];

    patterns.forEach((pattern) => {
      if (minimatch(file, pattern)) {
        matchingPatterns.push(pattern);
      }
    });

    if (matchingPatterns.length > 0) {
      fileMatches.push([file, matchingPatterns]);
    }
  });

  fileMatches.sort((a, b) => a[0].localeCompare(b[0]));

  return fileMatches;
}

function getPatternFiles(): Promise<[string, string | null][]> {
  const paths: string[] = [];

  process.argv.forEach((value, index) => {
    if (index <= 1) {
      return;
    }

    paths.push(value);
  });

  return Promise.all(
    paths.map(async (path) => {
      let data;

      try {
        data = await _readFile(normalize(path), {
          encoding: 'utf8',
        });
      } catch {
        data = null;
      }

      return [path, data];
    }),
  );
}

async function readPatternFile(path: string) {
  let data;

  try {
    data = await _readFile(normalize(path), {
      encoding: 'utf8',
    });
  } catch {
    data = null;
  }

  return (data || '').split('\n');
}
