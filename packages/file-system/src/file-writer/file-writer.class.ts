// Stryker disable all

import { noop } from 'lodash-es';
import { forkJoin, map, Observable } from 'rxjs';

import { File } from '../file/file.class';
import { FileSystem } from '../file-system/file-system.class';
import { writeFile } from './functions/write-file.function';

export abstract class FileWriter<T extends File<string>> {
  readonly writeFile: (file: T) => Observable<void>;
  readonly writeFiles: (files: T[]) => Observable<void>;

  constructor(
    protected fileSystem: FileSystem,
    protected encoding: BufferEncoding,
  ) {
    this.writeFile = (file: T) => writeFile(fileSystem)(file.getPath(), file.getContent(), encoding);

    this.writeFiles = (files: T[]) => forkJoin(files.map((file) => this.writeFile(file))).pipe(map(noop));
  }
}
