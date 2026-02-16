// Stryker disable all

import { getCurrentDirectory } from './functions/get-current-directory.function';
import { getExtendedCurrentDirectoryInfo } from './functions/get-extended-current-directory-info.function';

export class CurrentDirectory {
  readonly getCurrentDirectory = getCurrentDirectory();
  readonly getExtendedCurrentDirectoryInfo = getExtendedCurrentDirectoryInfo();
}
