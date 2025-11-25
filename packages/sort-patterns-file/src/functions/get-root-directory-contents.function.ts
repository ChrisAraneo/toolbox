import { glob } from 'glob';
import { performance } from 'just-performance';
import { concat, isUndefined } from 'lodash';
import { FileSystemNode } from 'src/interfaces/file-system-node.interface';

import { createFileSystemNodeMap } from './create-file-system-node-map.function';
import { createFileSystemPathInfos } from './create-file-system-path-infos.function';
import { getSortedKeys } from './get-sorted-keys.function';
import { getTimeDiff } from './get-time-diff.function';

let nodes: FileSystemNode[];

const createOrganizedFileSystemNodeArray = (
  directories: Record<string, FileSystemNode>,
): FileSystemNode[] => {
  const result: FileSystemNode[] = [];

  const keys = getSortedKeys(directories);

  keys
    .filter((item) => item !== '.')
    .forEach((key) => {
      const item = directories[key];

      item.files.sort((a, b) => a.localeCompare(b));

      result.push({
        name: key.trim(),
        parentDirectory: item.parentDirectory?.trim() ?? null,
        files: item.files.map((file) => file.trim()),
      });
    });

  result.push({
    name: '.',
    parentDirectory: null,
    files: directories['.'].files,
  });

  return result;
};

const getContents = async (
  ignoredDirectories: string[] = [],
): Promise<FileSystemNode[]> => {
  const contents = await glob('**', {
    ignore: ignoredDirectories.map((directory) => `${directory}/**`),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    dot: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    dotRelative: true,
  });

  const contentsWithIgnored = concat(contents, ignoredDirectories);

  const infos = createFileSystemPathInfos(contentsWithIgnored);

  const directoryMap = createFileSystemNodeMap(infos);

  return createOrganizedFileSystemNodeArray(directoryMap);
};

export const getRootDirectoryContents = async (
  ignoredDirectories: string[],
  options?: { willLogTime: boolean },
): Promise<FileSystemNode[]> => {
  if (isUndefined(nodes)) {
    const startTime = performance.now();

    // eslint-disable-next-line require-atomic-updates
    nodes = await getContents(ignoredDirectories);

    if (options?.willLogTime) {
      // eslint-disable-next-line no-console
      console.log(
        `Reading contents of directory and all subdirectories (${getTimeDiff(startTime)}ms)`,
      );
    }
  }

  return nodes;
};
