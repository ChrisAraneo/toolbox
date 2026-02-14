import { FileSystem } from 'index';
import { WriteFileOptions } from 'node:fs';
import { Observable } from 'rxjs';

export const writeFile =
  (fileSystem: FileSystem) =>
  (
    path: string,
    content: string,
    options: WriteFileOptions,
  ): Observable<void> => {
    return new Observable((subscriber) => {
      fileSystem.writeFile(path, content, options, (error: unknown) =>
        error
          ? subscriber.error(error)
          : (() => {
              subscriber.next();
              subscriber.complete();
            })(),
      );
    });
  };
