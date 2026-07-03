import { WriteFileOptions } from 'node:fs';

import { Observable } from 'rxjs';
import { match, P } from 'ts-pattern';

import { FileSystem } from '../../file-system/file-system.class';

const { when } = P;

export const writeFile =
  (fileSystem: FileSystem) => (
    path: string,
    content: string,
    options: WriteFileOptions,
  ): Observable<void> => new Observable((subscriber) => {
      fileSystem.writeFile(path, content, options, (error: unknown) => match(error)
          .with(when(Boolean), (err) => subscriber.error(err))
          .otherwise(() => {
            subscriber.next();
            subscriber.complete();
          }),
      );
    });
