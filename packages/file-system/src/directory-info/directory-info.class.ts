// Stryker disable all

import { getDirectoryContents } from './functions/get-directory-contents.function';

export class DirectoryInfo {
  readonly getContents = getDirectoryContents;
}
