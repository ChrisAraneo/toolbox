// Stryker disable all

import appRootPath from 'app-root-path';

export class CurrentDirectory {
  getCurrentDirectory(): string {
    return process.cwd();
  }

  getExtendedInfo(): object {
    return {
      dirname: __dirname,
      filename: __filename,
      root: appRootPath.toString(),
      cwd: process.cwd(),
    };
  }
}
