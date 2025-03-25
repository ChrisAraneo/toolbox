import { getRootDirectoryContents } from './functions/get-root-directory-contents.function';
import { ignoreNodeModules } from './functions/ignore-node-modules.function';
import { isMatchingDirectory } from './functions/is-matching-directory.function';
import { isMatchingFile } from './functions/is-matching-file.function';
import { isPatternsFileChanged } from './functions/is-patterns-file-changed.function';
import { readPatternsFile } from './functions/read-patterns-file.function';
import { sortArrayAlphabetically } from './functions/sort-array-alphabetically.function';
import { writePatternsFile } from './functions/write-patterns-file.function';
import { ExtendedFileSystemNode } from './interfaces/extended-file-system-node.interface';
import { FileSystemNode } from './interfaces/file-system-node.interface';

let nodes: FileSystemNode[];

export async function sortPatternsFile(
  path: string,
  ignoredDirectories: string[] = [],
): Promise<void> {
  if (!nodes) {
    nodes = await getRootDirectoryContents(ignoredDirectories, {
      logTime: true,
    });
  }

  const startTime = performance.now();

  const patterns = await readPatternsFile(path);

  const extendedNodes: ExtendedFileSystemNode[] = [];

  nodes.forEach((node) => {
    extendedNodes.push({
      ...node,
      matchingDirectories: [],
      matchingFiles: [],
    });
  });

  patterns.forEach((pattern) => {
    nodes.forEach((node, index) => {
      if (isMatchingDirectory(pattern, node.name)) {
        extendedNodes[index].matchingDirectories.push(pattern);
      }

      if (isMatchingFile(pattern, node.files)) {
        extendedNodes[index].matchingFiles.push(pattern);
      }
    });
  });

  let organizedPatterns: string[] = [];

  extendedNodes.forEach((node) => {
    sortArrayAlphabetically(node.matchingDirectories);

    node.matchingDirectories.forEach((pattern) => {
      if (!organizedPatterns.find((p) => p === pattern) && !!pattern) {
        organizedPatterns.push(pattern);
      }
    });

    sortArrayAlphabetically(node.matchingFiles);

    node.matchingFiles.forEach((pattern) => {
      if (!organizedPatterns.find((p) => p === pattern) && !!pattern) {
        organizedPatterns.push(pattern);
      }
    });
  });

  const nonMatchingPatterns: string[] = [];

  patterns.forEach((pattern) => {
    if (!organizedPatterns.find((p) => p === pattern) && pattern) {
      nonMatchingPatterns.push(pattern);
    }
  });

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
      `${path} ${(performance.now() - startTime).toPrecision(6) + 'ms'} (changed)`,
    );
  } else {
    console.log(
      `\x1b[90m${path} ${(performance.now() - startTime).toPrecision(6) + 'ms'}\x1b[0m (unchanged)`,
    );
  }
}
