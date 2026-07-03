import { noop } from 'lodash-es';
import { forkJoin, map, Observable } from 'rxjs';

import { TextFile } from '../../file/text-file.class';
import { FileSystem } from '../../file-system/file-system.class';

export const writeTextFile =
  (fileSystem: FileSystem) => (file: TextFile): Observable<void> => new Observable((subscriber) => {
      fileSystem.writeFile(
        file.getPath(),
        file.getContent(),
        'utf-8',
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

export const writeTextFiles =
  (fileSystem: FileSystem) => (files: TextFile[]): Observable<void> => forkJoin(files.map((file) => writeTextFile(fileSystem)(file))).pipe(
      map(noop),
    );
