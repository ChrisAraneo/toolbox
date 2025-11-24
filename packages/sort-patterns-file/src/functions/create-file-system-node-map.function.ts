import { isEmpty } from "lodash";
import { FileSystemNode } from "src/interfaces/file-system-node.interface";
import { FileSystemPathInfo } from "src/interfaces/file-system-path-info.interface";

import { getParentDirectory } from "./get-parent-directory.function";

export const createFileSystemNodeMap = (infos: FileSystemPathInfo[]): Record<string, FileSystemNode> =>
    infos.reduce<Record<string, FileSystemNode>>((directories, item) => {
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

        return directories;
    }, {});