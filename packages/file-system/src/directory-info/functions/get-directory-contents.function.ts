import { Observable } from 'rxjs';

import { FileSystem } from '../../file-system/file-system.class';

export const getDirectoryContents =
  (fileSystem: FileSystem) =>
  (directory: string): Observable<string[]> =>
    new Observable<string[]>((subscriber) => {
      fileSystem.readdir(directory, (error: unknown, files: string[]): void => {
        error
          ? subscriber.error(error)
          : (() => {
              subscriber.next(files);
              subscriber.complete();
            })();
      });
    });
