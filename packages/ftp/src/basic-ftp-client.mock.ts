/* eslint-disable @typescript-eslint/no-unused-vars */

import { AccessOptions, FTPResponse } from 'basic-ftp';

// Stryker disable all : It's mock

export class BasicFtpClientMock {
  access(_options?: AccessOptions): Promise<FTPResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: '',
        });
      }, 200);
    });
  }

  uploadFromDir(_localDirPath: string, _remoteDirPath?: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }
}
