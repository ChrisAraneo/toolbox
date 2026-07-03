import { glob } from 'glob';
import { performance } from 'just-performance';
import { chain, map, noop } from 'lodash-es';
import { match } from 'ts-pattern';

import { FileSystemNode } from '../interfaces/file-system-node.interface';
import { GetRootDirectoryContentsOptions } from '../interfaces/get-root-directory-contents-options.interface';
import { createFileSystemNodeMap } from './create-file-system-node-map.function';
import { createFileSystemPathInfos } from './create-file-system-path-infos.function';
import { createOrganizedFileSystemNodeArray } from './create-organized-file-system-node-array.function';
import { getTimeDiff } from './get-time-diff.function';

const DEFAULT_OPTIONS: GetRootDirectoryContentsOptions = {
  withTimeLogging: true,
  withCache: true,
};

const cache: { nodes: FileSystemNode[] | null } = { nodes: null };

const logWhen = (enabled: boolean | undefined, message: string): void =>
  match(Boolean(enabled))
    .with(true, () => console.log(message))
    .otherwise(noop);

const readDirectoryContents = async (
  ignoredDirectories: string[],
): Promise<FileSystemNode[]> => {
  const contents = await glob('**', {
    ignore: map(ignoredDirectories, (directory: string) => `${directory}/**`),
    dot: true,
    dotRelative: true,
  });

  return chain([...contents, ...ignoredDirectories])
    .thru(createFileSystemPathInfos)
    .thru(createFileSystemNodeMap)
    .thru(createOrganizedFileSystemNodeArray)
    .value();
};

export const getRootDirectoryContents = async (
  ignoredDirectories: string[],
  options: GetRootDirectoryContentsOptions = DEFAULT_OPTIONS,
): Promise<FileSystemNode[]> => {
  const startTime = performance.now();

  // Stryker disable all
  cache.nodes = match(options.withCache)
    .with(false, () => null)
    .otherwise(() => cache.nodes);
  // Stryker restore all

  return match(cache.nodes !== null)
    .with(true, async () => {
      // Stryker disable all
      logWhen(
        options.withTimeLogging,
        `Reading contents of directory and all subdirectories (${getTimeDiff(startTime)}ms) (cached)`,
      );
      // Stryker restore all

      return cache.nodes as FileSystemNode[];
    })
    .otherwise(async () => {
      const freshNodes = await readDirectoryContents(ignoredDirectories);

      cache.nodes = freshNodes;

      // Stryker disable all
      logWhen(
        options.withTimeLogging,
        `Reading contents of directory and all subdirectories (${getTimeDiff(startTime)}ms)`,
      );
      // Stryker restore all

      return freshNodes;
    });
};
