import { minimatch } from 'minimatch';

import { getContents } from './get-contents.function';
import { isPatternsFileChanged } from './is-patterns-file-changed.function';
import { readPatternsFile } from './read-patterns-file.function';
import { writePatternsFile } from './write-patterns-file.function';

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
      `Reading the contents of directory and all subdirectories ${getContentsEndTime - getContentsStartTime + 'ms'} `,
    );
  }

  const startTime = performance.now();

  const patterns = await readPatternsFile(path);

  patterns.push('node_modules');

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
  organizedPatterns.push('');

  if (isPatternsFileChanged(patterns, organizedPatterns)) {
    await writePatternsFile(path, organizedPatterns);

    const endTime = performance.now();

    console.log(`${path} ${endTime - startTime + 'ms'} (changed)`);
  } else {
    const endTime = performance.now();

    console.log(
      `${path} ${endTime - startTime + 'ms'} \x1b[90m(unchanged)\x1b[0m`,
    );
  }
}
