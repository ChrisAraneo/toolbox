// Stryker disable all

import { concat, filter, includes, isEmpty, map, reduce } from 'lodash-es';
import { match } from 'ts-pattern';

import { appendNewPatterns } from './functions/append-new-patterns.function';
import { getRootDirectoryContents } from './functions/get-root-directory-contents.function';
import { getTimeDiff } from './functions/get-time-diff.function';
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

const state: { nodes: FileSystemNode[]; ignoredDirectories: string[] } = {
  nodes: [],
  ignoredDirectories: [],
};

const isStateStale = (ignoredDirectories: string[]): boolean =>
  isEmpty(state.nodes) ||
  isArrayDiff(state.ignoredDirectories, ignoredDirectories);

const refreshState = async (ignoredDirectories: string[]): Promise<void> => {
  state.nodes = await getRootDirectoryContents(ignoredDirectories, {
    withTimeLogging: true,
    withCache: true,
  });
  state.ignoredDirectories = ignoredDirectories;
};

const ensureState = async (ignoredDirectories: string[]): Promise<void> =>
  match(isStateStale(ignoredDirectories))
    .with(true, () => refreshState(ignoredDirectories))
    .otherwise(() => Promise.resolve());

const toExtendedNode = (
  patterns: string[],
  node: FileSystemNode,
): ExtendedFileSystemNode => ({
  ...node,
  matchingDirectories: filter(patterns, (pattern: string) =>
    isMatchingDirectory(pattern, node.name),
  ),
  matchingFiles: filter(patterns, (pattern: string) =>
    isMatchingFile(pattern, node.files),
  ),
});

const toMatchedPatterns = (extendedNodes: ExtendedFileSystemNode[]): string[] =>
  reduce(
    extendedNodes,
    (matched: string[], node: ExtendedFileSystemNode) => {
      sortByMatchingDirectories(node);
      appendNewPatterns(matched, node.matchingDirectories);
      sortByMatchingFiles(node);
      appendNewPatterns(matched, node.matchingFiles);

      return matched;
    },
    [] as string[],
  );

const toNonMatchingPatterns = (
  patterns: string[],
  matchedPatterns: string[],
): string[] => {
  const nonMatching = filter(
    patterns,
    (pattern: string) =>
      Boolean(pattern) && !includes(matchedPatterns, pattern),
  );

  sortArrayAlphabetically(nonMatching);

  return nonMatching;
};

const toOrganizedPatterns = (
  patterns: string[],
  extendedNodes: ExtendedFileSystemNode[],
): string[] => {
  const matchedPatterns = toMatchedPatterns(extendedNodes);

  return filter(
    concat(matchedPatterns, toNonMatchingPatterns(patterns, matchedPatterns)),
    Boolean,
  );
};

const logResult = (
  path: string,
  startTime: number,
  wasChanged: boolean,
): void =>
  match(wasChanged)
    .with(true, () => console.log(`${path} ${getTimeDiff(startTime)}ms (changed)`))
    .otherwise(() =>
      console.log(
        `\u001B[90m${path} ${getTimeDiff(startTime)}ms\u001B[0m (unchanged)`,
      ),
    );

const applyOrganizedPatterns = async (
  path: string,
  patterns: string[],
  organizedPatterns: string[],
  startTime: number,
): Promise<void> =>
  match(isPatternsFileChanged(ignoreNodeModules(patterns), ignoreNodeModules(organizedPatterns)))
    .with(true, async () => {
      await writePatternsFile(path, organizedPatterns);
      logResult(path, startTime, true);
    })
    .otherwise(async () => logResult(path, startTime, false));

export const sortPatternsFile = async (
  path: string,
  ignoredDirectories: string[] = [],
): Promise<void> => {
  await ensureState(ignoredDirectories);

  const startTime = performance.now();

  const patterns = await readPatternsFile(path);

  const extendedNodes = map(state.nodes, (node: FileSystemNode) =>
    toExtendedNode(patterns, node),
  );

  const organizedPatterns = toOrganizedPatterns(patterns, extendedNodes);

  await applyOrganizedPatterns(path, patterns, organizedPatterns, startTime);
};
