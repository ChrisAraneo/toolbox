import { map } from 'lodash-es';
import { forkJoin, Observable } from 'rxjs';

import { File } from '../file/file.class';
import { FileSystem } from '../file-system/file-system.class';
import { ReadFileError } from './types/read-file-error.interface';

export abstract class FileReader<
  T extends File<string | object> | ReadFileError,
> {
  constructor(protected fileSystem: FileSystem) {}

  readFiles(paths: string[]): Observable<T[]> {
    return forkJoin(map(paths, (path: string) => this.readFile(path)));
  }

  abstract readFile(path: string): Observable<T>;
}
