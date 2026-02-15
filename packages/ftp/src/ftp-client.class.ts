// Stryker disable all

import * as BasicFtp from 'basic-ftp';
import { uploadDirectory } from './upload-directory/upload-directory';

export class FtpClient {
  readonly uploadDirectory: ReturnType<typeof uploadDirectory>;

  constructor(client: BasicFtp.Client) {
    this.uploadDirectory = uploadDirectory(client);
  }
}
