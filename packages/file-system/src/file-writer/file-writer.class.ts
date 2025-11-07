import { forkJoin, map, Observable } from 'rxjs';

import { File } from '../file/file.class';
import { FileSystem } from '../file-system/file-system.class';

export abstract class FileWriter<T extends File<string>> {
  constructor(
    protected fileSystem: FileSystem,
    protected encoding: BufferEncoding,
  ) {}

  writeFile(file: T): Observable<void> {
    return new Observable((subscriber) => {
      this.fileSystem.writeFile(
        file.getPath(),
        file.getContent(),
        this.encoding,
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
  }

  writeFiles(files: T[]): Observable<void> {
    return forkJoin(files.map((file) => this.writeFile(file))).pipe(
      map(() => {}),
    );
  }
}
