/* eslint-disable require-atomic-updates */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */

import { glob } from 'glob';
import { performance } from 'just-performance';
import { concat, isNull } from 'lodash';
import { FileSystemNode } from 'src/interfaces/file-system-node.interface';
import { GetRootDirectoryContentsOptions } from 'src/interfaces/get-root-directory-contents-options.interface';

import { createFileSystemNodeMap } from './create-file-system-node-map.function';
import { createFileSystemPathInfos } from './create-file-system-path-infos.function';
import { createOrganizedFileSystemNodeArray } from './create-organized-file-system-node-array.function';
import { getTimeDiff } from './get-time-diff.function';

const DEFAULT_OPTIONS: GetRootDirectoryContentsOptions = {
  withTimeLogging: true,
  withCache: true,
};

let nodes: FileSystemNode[] | null = null;

export const getRootDirectoryContents = async (
  ignoredDirectories: string[],
  options: GetRootDirectoryContentsOptions = DEFAULT_OPTIONS,
): Promise<FileSystemNode[]> => {
  const startTime = performance.now();

  // Stryker disable all
  if (options.withCache === false) {
    nodes = null;
  }

  if (!isNull(nodes)) {
    if (options.withTimeLogging) {
      console.log(
        `Reading contents of directory and all subdirectories (${getTimeDiff(startTime)}ms) (cached)`,
      );
    }

    return nodes;
  }
  // Stryker restore all

  const contents = await glob('**', {
    ignore: ignoredDirectories.map((directory) => `${directory}/**`),
    dot: true,
    dotRelative: true,
  });

  const contentsWithIgnored = concat(contents, ignoredDirectories);

  const infos = createFileSystemPathInfos(contentsWithIgnored);

  const directoryMap = createFileSystemNodeMap(infos);

  nodes = createOrganizedFileSystemNodeArray(directoryMap);

  // Stryker disable all
  if (options.withTimeLogging) {
    console.log(
      `Reading contents of directory and all subdirectories (${getTimeDiff(startTime)}ms)`,
    );
  }
  // Stryker restore all

  return nodes;
};
