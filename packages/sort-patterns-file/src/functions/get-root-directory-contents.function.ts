import { lstatSync } from 'node:fs';
import { normalize } from 'node:path';

import { glob } from 'glob';
import { FileSystemNode } from 'src/interfaces/file-system-node.interface';

import { getParentDirectory } from './get-parent-directory.function';

let nodes: FileSystemNode[] = [];

export async function getRootDirectoryContents(
  ignoredDirectories: string[],
  options?: { logTime: boolean },
) {
  if (!nodes) {
    const startTime = performance.now();

    nodes = await getContents(ignoredDirectories);

    const endTime = performance.now();

    if (options?.logTime) {
      console.log(
        `Reading contents of directory and all subdirectories (${(endTime - startTime).toPrecision(6)}ms)`,
      );
    }
  }

  return nodes;
}

async function getContents(
  ignoredDirectories: string[] = [],
): Promise<FileSystemNode[]> {
  const contents = await glob('**', {
    ignore: ignoredDirectories.map((directory) => `${directory}/**`),
    dot: true,
    dotRelative: true,
  });

  for (const directory of ignoredDirectories) {
    contents.push(directory);
  }

  const infos = contents
    .map((path) => path.trim())
    .filter(Boolean)
    .map((path) => normalize(path))
    .map((path) => ({
      path,
      isDirectory: lstatSync(path).isDirectory(),
      isFile: lstatSync(path).isFile(),
    }));

  const directories: Record<
    string,
    { files: string[]; parentDirectory: string | null }
  > = {};

  for (const item of infos) {
    const parentDirectory = getParentDirectory(item.path);

    if (item.isDirectory && !directories[item.path]) {
      directories[item.path] = {
        parentDirectory,
        files: [],
      };
    } else if (item.isFile && !directories[parentDirectory]) {
      directories[parentDirectory] = {
        parentDirectory: getParentDirectory(parentDirectory),
        files: [item.path],
      };
    } else if (item.isFile && directories[parentDirectory]) {
      directories[parentDirectory] = {
        ...directories[parentDirectory],
        files: [...directories[parentDirectory].files, item.path],
      };
    }
  }

  const keys = Object.keys(directories);

  keys.sort((a, b) => a.localeCompare(b));

  const result: {
    name: string;
    parentDirectory: string | null;
    files: string[];
  }[] = [];

  for (const key of keys.filter((key) => key !== '.')) {
    const item = directories[key];

    item.files.sort((a, b) => a.localeCompare(b));

    result.push({
      name: key.trim(),
      parentDirectory: item.parentDirectory?.trim() || null,
      files: item.files.map((file) => file.trim()),
    });
  }

  result.push({
    name: '.',
    parentDirectory: null,
    files: directories['.'].files,
  });

  return result;
}
