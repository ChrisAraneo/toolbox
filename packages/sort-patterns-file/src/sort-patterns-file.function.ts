import { minimatch } from 'minimatch';

import { getContents } from './functions/get-contents.function';
import { ignoreNodeModules } from './functions/ignore-node-modules.function';
import { isPatternsFileChanged } from './functions/is-patterns-file-changed.function';
import { readPatternsFile } from './functions/read-patterns-file.function';
import { removeArrayItem } from './functions/remove-array-item.function';
import { writePatternsFile } from './functions/write-patterns-file.function';

let contents: {
  name: string;
  parentDirectory: string | null;
  files: string[];
}[];

export async function sortPatternsFile(path: string): Promise<void> {
  if (!contents) {
    const getContentsStartTime = performance.now();

    contents = await getContents();

    const getContentsEndTime = performance.now();

    console.log(
      `Reading contents of directory and subdirectories ${(getContentsEndTime - getContentsStartTime).toPrecision(6) + 'ms'} `,
    );
  }

  const startTime = performance.now();

  const patterns = await readPatternsFile(path);

  let hasTemporaryNodeModules = false;

  if (patterns.findIndex((pattern) => pattern === 'node_modules') < 0) {
    patterns.push('node_modules');
    hasTemporaryNodeModules = true;
  }

  const contentsWithMatchings: {
    name: string;
    parentDirectory: string | null;
    files: string[];
    matchingDirectory: string[];
    matchingFile: string[];
  }[] = [];
  contents.forEach((item) => {
    contentsWithMatchings.push({
      ...item,
      matchingDirectory: [],
      matchingFile: [],
    });
  });

  patterns.forEach((pattern) => {
    contents.forEach((item, index) => {
      const directory = item.name;
      const files = item.files;

      const isMatchingDirectory = minimatch(directory, pattern);
      let isMatchingFile = false;

      for (let i = 0; i < files.length && !isMatchingFile; i++) {
        if (minimatch(files[i], pattern)) {
          isMatchingFile = true;
        }
      }

      if (isMatchingDirectory) {
        contentsWithMatchings[index].matchingDirectory.push(pattern);
      }

      if (isMatchingFile) {
        contentsWithMatchings[index].matchingFile.push(pattern);
      }
    });
  });

  let organizedPatterns: string[] = [];

  contentsWithMatchings.forEach((item) => {
    item.matchingDirectory.sort((a, b) => a.localeCompare(b));
    item.matchingDirectory.forEach((pattern) => {
      if (!organizedPatterns.find((p) => p === pattern) && !!pattern) {
        organizedPatterns.push(pattern);
      }
    });

    item.matchingFile.sort((a, b) => a.localeCompare(b));
    item.matchingFile.forEach((pattern) => {
      if (!organizedPatterns.find((p) => p === pattern) && !!pattern) {
        organizedPatterns.push(pattern);
      }
    });
  });

  const patternsNotMatchingAnything: string[] = [];

  patterns.forEach((pattern) => {
    if (!organizedPatterns.find((p) => p === pattern) && pattern) {
      patternsNotMatchingAnything.push(pattern);
    }
  });

  patternsNotMatchingAnything.sort((a, b) => a.localeCompare(b));

  organizedPatterns = [
    ...organizedPatterns,
    ...patternsNotMatchingAnything,
  ].filter(Boolean);

  if (hasTemporaryNodeModules) {
    removeArrayItem(patterns, 'node_modules');
    removeArrayItem(organizedPatterns, 'node_modules');
  }

  if (
    isPatternsFileChanged(
      ignoreNodeModules(patterns),
      ignoreNodeModules(organizedPatterns),
    )
  ) {
    organizedPatterns.push('');

    await writePatternsFile(path, organizedPatterns);

    const endTime = performance.now();

    console.log(`${path} ${(endTime - startTime).toPrecision(6) + 'ms'} (changed)`);
  } else {
    const endTime = performance.now();

    console.log(
      `\x1b[90m${path} ${(endTime - startTime).toPrecision(6) + 'ms'}\x1b[0m (unchanged)`,
    );
  }
}
