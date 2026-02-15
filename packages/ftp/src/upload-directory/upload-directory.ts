import * as BasicFtp from 'basic-ftp';
import { from, map, mergeMap } from 'rxjs';
import { UploadDirectoryOptions } from './upload-directory-options.interface';

export const uploadDirectory =
  (client: BasicFtp.Client = new BasicFtp.Client()) =>
  ({ host, user, password, localPath, remotePath }: UploadDirectoryOptions) =>
    from(client.access({ host, user, password })).pipe(
      mergeMap(() => from(client.uploadFrom(localPath, remotePath))),
      map(() => void 0),
    );
