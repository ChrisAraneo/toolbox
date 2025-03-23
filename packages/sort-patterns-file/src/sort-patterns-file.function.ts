import {
  ContentItem,
  getRootDirectoryContents,
} from './functions/get-root-directory-contents.function';
import { ignoreNodeModules } from './functions/ignore-node-modules.function';
import { isMatchingDirectory } from './functions/is-matching-directory.function';
import { isMatchingFile } from './functions/is-matching-file.function';
import { isPatternsFileChanged } from './functions/is-patterns-file-changed.function';
import { readPatternsFile } from './functions/read-patterns-file.function';
import { writePatternsFile } from './functions/write-patterns-file.function';

let contents: ContentItem[];

export async function sortPatternsFile(
  path: string,
  ignoredDirectories: string[] = [],
): Promise<void> {
  if (!contents) {
    contents = await getRootDirectoryContents(ignoredDirectories);
  }

  const startTime = performance.now();

  const patterns = await readPatternsFile(path);

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
      if (isMatchingDirectory(pattern, item.name)) {
        contentsWithMatchings[index].matchingDirectory.push(pattern);
      }

      if (isMatchingFile(pattern, item.files)) {
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

  if (
    isPatternsFileChanged(
      ignoreNodeModules(patterns),
      ignoreNodeModules(organizedPatterns),
    )
  ) {
    await writePatternsFile(path, organizedPatterns);

    const endTime = performance.now();

    console.log(
      `${path} ${(endTime - startTime).toPrecision(6) + 'ms'} (changed)`,
    );
  } else {
    const endTime = performance.now();

    console.log(
      `\x1b[90m${path} ${(endTime - startTime).toPrecision(6) + 'ms'}\x1b[0m (unchanged)`,
    );
  }
}
