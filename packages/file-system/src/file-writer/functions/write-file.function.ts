import { WriteFileOptions } from 'node:fs';

import { FileSystem } from '../../file-system/file-system.class';
import { Observable } from 'rxjs';

export const writeFile =
  (fileSystem: FileSystem) =>
  (
    path: string,
    content: string,
    options: WriteFileOptions,
  ): Observable<void> =>
    new Observable((subscriber) => {
      fileSystem.writeFile(path, content, options, (error: unknown) =>
        error
          ? subscriber.error(error)
          : (() => {
              subscriber.next();
              subscriber.complete();
            })(),
      );
    });
