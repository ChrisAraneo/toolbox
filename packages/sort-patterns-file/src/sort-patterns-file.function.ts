/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-console */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { isEmpty } from 'lodash';

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
import { getTimeDiff } from './utils/get-time-diff.function';

const state = {
  nodes: [] as FileSystemNode[],
  ignoredDirectories: [] as string[],
}

const updateState = async (
  nodes: FileSystemNode[],
  ignoredDirectories: string[],
): Promise<void> => {
  state.nodes = nodes;
  state.ignoredDirectories = ignoredDirectories;
}

export const sortPatternsFile = async (
  path: string,
  ignoredDirectories: string[] = [],
): Promise<void> => {
  if (isEmpty(state.nodes) || isArrayDiff(state.ignoredDirectories, ignoredDirectories)) {
    const updatedNodes = await getRootDirectoryContents(ignoredDirectories, {
      logTime: true,
    });

    await updateState(updatedNodes, ignoredDirectories);
  }

  const startTime = performance.now();

  const patterns = await readPatternsFile(path);

  const extendedNodes: ExtendedFileSystemNode[] = state.nodes.map((node) => ({
    ...node,
    matchingDirectories: [],
    matchingFiles: [],
  }));

  for (const pattern of patterns) {
    for (const [index, node] of state.nodes.entries()) {
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
      `${path} ${getTimeDiff(startTime)}ms (changed)`,
    );
  } else {
    console.log(
      `\u001B[90m${path} ${getTimeDiff(startTime)}ms\u001B[0m (unchanged)`,
    );
  }
};
