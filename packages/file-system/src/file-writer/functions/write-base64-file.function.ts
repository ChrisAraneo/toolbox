import { noop } from 'lodash-es';
import { forkJoin, map, Observable } from 'rxjs';
import { match, P } from 'ts-pattern';

import { Base64File } from '../../file/base64-file.class';
import { FileSystem } from '../../file-system/file-system.class';

const { when } = P;

export const writeBase64File =
  (fileSystem: FileSystem) =>
  (file: Base64File): Observable<void> =>
    new Observable((subscriber) => {
      fileSystem.writeFile(
        file.getPath(),
        file.getContent(),
        'base64',
        (error: unknown) =>
          match(error)
            .with(when(Boolean), (err) => subscriber.error(err))
            .otherwise(() => {
              subscriber.next();
              subscriber.complete();
            }),
      );
    });

export const writeBase64Files =
  (fileSystem: FileSystem) =>
  (files: Base64File[]): Observable<void> =>
    forkJoin(files.map((file) => writeBase64File(fileSystem)(file))).pipe(
      map(noop),
    );
