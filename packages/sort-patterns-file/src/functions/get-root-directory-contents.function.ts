import { lstatSync } from 'node:fs';
import { normalize } from 'node:path';

import { glob } from 'glob';
import { performance } from 'just-performance';
import { isEmpty, isUndefined } from 'lodash';
import { FileSystemNode } from 'src/interfaces/file-system-node.interface';
import { FileSystemPathInfo } from 'src/interfaces/file-system-path-info.interface';

import { getParentDirectory } from './get-parent-directory.function';
import { getSortedKeys } from './get-sorted-keys.function';

const LOG_TIME_PRECISION = 6;

let nodes: FileSystemNode[];

const appendIgnoredDirectories = (contents: string[], ignoredDirectories: string[]): void => {
  for (const directory of ignoredDirectories) {
    contents.push(directory);
  }
}

const createFileSystemPathInfos = (paths: string[]): FileSystemPathInfo[] => paths
  .map((path) => path.trim())
  .filter(Boolean)
  .map((path) => normalize(path))
  .map((path) => ({
    path,
    isDirectory: lstatSync(path).isDirectory(),
    isFile: lstatSync(path).isFile(),
  }));

const createFileSystemNodeMap = (infos: FileSystemPathInfo[]): Record<string, FileSystemNode> => {
  const directories: Record<
    string,
    FileSystemNode
  > = {};

  infos.forEach((item) => {
    const parentDirectory = getParentDirectory(item.path);

    if (item.isDirectory && isEmpty(directories[item.path])) {
      directories[item.path] = {
        name: item.path.trim(),
        parentDirectory,
        files: [],
      };
    } else if (item.isFile && isEmpty(directories[parentDirectory])) {
      directories[parentDirectory] = {
        name: parentDirectory.trim(),
        parentDirectory: getParentDirectory(parentDirectory),
        files: [item.path],
      };
    } else if (item.isFile && !isEmpty(directories[parentDirectory])) {
      directories[parentDirectory] = {
        ...directories[parentDirectory],
        files: [...directories[parentDirectory].files, item.path],
      };
    }
  });

  return directories;
};

const createOrganizedFileSystemNodeArray = (directories: Record<string, FileSystemNode>): FileSystemNode[] => {
  const result: FileSystemNode[] = [];

  const keys = getSortedKeys(directories);

  keys.filter((item) => item !== '.').forEach((key) => {
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
}

const getContents = async (
  ignoredDirectories: string[] = [],
): Promise<FileSystemNode[]> => {
  const contents = await glob('**', {
    ignore: ignoredDirectories.map((directory) => `${directory}/**`),
    dot: true,
    dotRelative: true,
  });

  appendIgnoredDirectories(contents, ignoredDirectories);

  const infos = createFileSystemPathInfos(contents);

  const directoryMap = createFileSystemNodeMap(infos);

  return createOrganizedFileSystemNodeArray(directoryMap);
};

export const getRootDirectoryContents = async (
  ignoredDirectories: string[],
  options?: { logTime: boolean },
): Promise<FileSystemNode[]> => {
  if (isUndefined(nodes)) {
    const startTime = performance.now();

    // eslint-disable-next-line require-atomic-updates
    nodes = await getContents(ignoredDirectories);

    const endTime = performance.now();

    if (options?.logTime) {
      // eslint-disable-next-line no-console
      console.log(
        `Reading contents of directory and all subdirectories (${(endTime - startTime).toPrecision(LOG_TIME_PRECISION)}ms)`,
      );
    }
  }

  return nodes;
};

