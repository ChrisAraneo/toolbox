import { minimatch } from "minimatch";

export function isMatchingFile(pattern: string, files: string[]): boolean {
    let isMatchingFile = false;
  
    for (let i = 0; i < files.length && !isMatchingFile; i++) {
      if (minimatch(files[i], pattern)) {
        isMatchingFile = true;
      }
    }
  
    return isMatchingFile;
  }