import { FileSystemNode } from './file-system-node.interface';

export interface ExtendedFileSystemNode extends FileSystemNode {
  matchingDirectories: string[];
  matchingFiles: string[];
}
