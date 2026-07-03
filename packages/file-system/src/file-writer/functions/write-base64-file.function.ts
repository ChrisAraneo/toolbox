import { noop } from 'lodash-es';
import { forkJoin, map, Observable } from 'rxjs';

import { Base64File } from '../../file/base64-file.class';
import { FileSystem } from '../../file-system/file-system.class';

export const writeBase64File =
  (fileSystem: FileSystem) => (file: Base64File): Observable<void> => new Observable((subscriber) => {
      fileSystem.writeFile(
        file.getPath(),
        file.getContent(),
        'base64',
        (error: unknown) => {
          if (error) {
            subscriber.error(error);
          } else {
            subscriber.next();
            subscriber.complete();
          }
        },
      );
    });

export const writeBase64Files =
  (fileSystem: FileSystem) => (files: Base64File[]): Observable<void> => forkJoin(files.map((file) => writeBase64File(fileSystem)(file))).pipe(
      map(noop),
    );
