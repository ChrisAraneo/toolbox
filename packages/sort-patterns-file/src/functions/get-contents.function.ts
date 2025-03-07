import { lstatSync } from 'fs';
import { glob } from 'glob';
import { normalize } from 'path';

import { getParentDirectory } from './get-parent-directory.function';

export async function getContents() {
  const contents = await glob('**', { ignore: 'node_modules' });

  const infos = contents
    .map((path) => normalize(path))
    .map((path) => {
      return {
        path: path,
        isDirectory: lstatSync(path).isDirectory(),
        isFile: lstatSync(path).isFile(),
      };
    });

  const directories: Record<
    string,
    { files: string[]; parentDirectory: string | null }
  > = {};

  infos.forEach((item) => {
    const parentDirectory = getParentDirectory(item.path);

    if (item.isDirectory && !directories[item.path]) {
      directories[item.path] = {
        parentDirectory: parentDirectory,
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
  });

  const keys = Object.keys(directories);

  keys.sort((a, b) => a.localeCompare(b));

  const result: {
    name: string;
    parentDirectory: string | null;
    files: string[];
  }[] = [];

  keys
    .filter((key) => key !== '.')
    .forEach((key) => {
      const item = directories[key];

      item.files.sort((a, b) => a.localeCompare(b));

      result.push({
        name: key,
        parentDirectory: item.parentDirectory,
        files: item.files,
      });
    });

  result.push({
    name: '.',
    parentDirectory: null,
    files: directories['.'].files,
  });

  return result;
}
