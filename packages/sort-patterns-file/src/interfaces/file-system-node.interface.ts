export interface FileSystemNode {
  name: string;
  parentDirectory: string | null;
  files: string[];
}
