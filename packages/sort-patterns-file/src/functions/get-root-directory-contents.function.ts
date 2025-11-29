import { glob } from 'glob';
import { performance } from 'just-performance';
import { concat, isUndefined } from 'lodash';
import { FileSystemNode } from 'src/interfaces/file-system-node.interface';

import { createFileSystemNodeMap } from './create-file-system-node-map.function';
import { createFileSystemPathInfos } from './create-file-system-path-infos.function';
import { createOrganizedFileSystemNodeArray } from './create-organized-file-system-node-array.function';
import { getTimeDiff } from './get-time-diff.function';

let nodes: FileSystemNode[];

export const getRootDirectoryContents = async (
  ignoredDirectories: string[],
  options?: { willLogTime: boolean },
): Promise<FileSystemNode[]> => {
  if (isUndefined(nodes)) {
    const startTime = performance.now();

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

    // eslint-disable-next-line require-atomic-updates
    nodes = createOrganizedFileSystemNodeArray(directoryMap);

    if (options?.willLogTime) {
      // eslint-disable-next-line no-console
      console.log(
        `Reading contents of directory and all subdirectories (${getTimeDiff(startTime)}ms)`,
      );
    }
  }

  return nodes;
};
