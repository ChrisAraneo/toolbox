/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-console */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { isEmpty } from 'lodash';

import { LOG_TIME_PRECISION } from './consts';
import { appendNewPatterns } from './functions/append-new-patterns.function';
import { getRootDirectoryContents } from './functions/get-root-directory-contents.function';
import { ignoreNodeModules } from './functions/ignore-node-modules.function';
import { isArrayDiff } from './functions/is-array-diff.function';
import { isMatchingDirectory } from './functions/is-matching-directory.function';
import { isMatchingFile } from './functions/is-matching-file.function';
import { isPatternsFileChanged } from './functions/is-patterns-file-changed.function';
import { readPatternsFile } from './functions/read-patterns-file.function';
import { sortArrayAlphabetically } from './functions/sort-array-alphabetically.function';
import { sortByMatchingDirectories } from './functions/sort-by-matching-directories.function';
import { sortByMatchingFiles } from './functions/sort-by-matching-files.function';
import { writePatternsFile } from './functions/write-patterns-file.function';
import { ExtendedFileSystemNode } from './interfaces/extended-file-system-node.interface';
import { FileSystemNode } from './interfaces/file-system-node.interface';

let nodes: FileSystemNode[];
let ignoredDirectories_: string[] = [];

export const sortPatternsFile = async (
  path: string,
  ignoredDirectories: string[] = [],
): Promise<void> => {
  if (isEmpty(nodes) || isArrayDiff(ignoredDirectories, ignoredDirectories_)) {
    nodes = await getRootDirectoryContents(ignoredDirectories, {
      logTime: true,
    });
    ignoredDirectories_ = ignoredDirectories;
  }

  const startTime = performance.now();

  const patterns = await readPatternsFile(path);

  const extendedNodes: ExtendedFileSystemNode[] = nodes.map((node) => ({
    ...node,
    matchingDirectories: [],
    matchingFiles: [],
  }));

  for (const pattern of patterns) {
    for (const [index, node] of nodes.entries()) {
      if (isMatchingDirectory(pattern, node.name)) {
        extendedNodes[index].matchingDirectories.push(pattern);
      }

      if (isMatchingFile(pattern, node.files)) {
        extendedNodes[index].matchingFiles.push(pattern);
      }
    }
  }

  let organizedPatterns: string[] = [];

  for (const node of extendedNodes) {
    sortByMatchingDirectories(node);

    appendNewPatterns(organizedPatterns, node.matchingDirectories);

    sortByMatchingFiles(node);

    appendNewPatterns(organizedPatterns, node.matchingFiles);
  }

  const nonMatchingPatterns: string[] = [];

  appendNewPatterns(nonMatchingPatterns, patterns);

  sortArrayAlphabetically(nonMatchingPatterns);

  organizedPatterns = [...organizedPatterns, ...nonMatchingPatterns].filter(
    Boolean,
  );

  if (
    isPatternsFileChanged(
      ignoreNodeModules(patterns),
      ignoreNodeModules(organizedPatterns),
    )
  ) {
    await writePatternsFile(path, organizedPatterns);

    console.log(
      `${path} ${(performance.now() - startTime).toPrecision(LOG_TIME_PRECISION)}ms (changed)`,
    );
  } else {
    console.log(
      `\u001B[90m${path} ${(performance.now() - startTime).toPrecision(LOG_TIME_PRECISION)}ms\u001B[0m (unchanged)`,
    );
  }
};
