import { catchError, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { match } from 'ts-pattern';

import { TextFile } from '../../file/text-file.class';
import { FileSystem } from '../../file-system/file-system.class';
import { ReadFileError } from '../types/read-file-error.interface';
import { ReadFileResultStatus } from '../types/read-file-result-status.enum';
import { readFile } from './read-file.function';
import { readPathMetadata } from './read-path-metadata.function';

export const readTextFile = (fileSystem: FileSystem) => (path: string) =>
  readPathMetadata(fileSystem)(path)
    .pipe(mergeMap(() => readFile(fileSystem)(path)))
    .pipe(
      map((result) =>
        match(result)
          .with(
            { status: ReadFileResultStatus.Success },
            (success) =>
              new TextFile(success.path, success.data, success.modifiedDate),
          )
          .otherwise(() => result),
      ),
      catchError((error: unknown) =>
        of({
          status: ReadFileResultStatus.Error,
          message: error?.toString(),
        } as ReadFileError),
      ),
    );
