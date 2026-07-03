import { noop } from 'lodash-es';
import { forkJoin, map, Observable } from 'rxjs';
import { match, P } from 'ts-pattern';

import { TextFile } from '../../file/text-file.class';
import { FileSystem } from '../../file-system/file-system.class';

const { when } = P;

export const writeTextFile =
  (fileSystem: FileSystem) =>
  (file: TextFile): Observable<void> =>
    new Observable((subscriber) => {
      fileSystem.writeFile(
        file.getPath(),
        file.getContent(),
        'utf-8',
        (error: unknown) =>
          match(error)
            .with(when(Boolean), (err) => subscriber.error(err))
            .otherwise(() => {
              subscriber.next();
              subscriber.complete();
            }),
      );
    });

export const writeTextFiles =
  (fileSystem: FileSystem) =>
  (files: TextFile[]): Observable<void> =>
    forkJoin(files.map((file) => writeTextFile(fileSystem)(file))).pipe(
      map(noop),
    );
