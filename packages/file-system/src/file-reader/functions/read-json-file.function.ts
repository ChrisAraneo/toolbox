import { catchError, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { FileSystem } from '../../file-system/file-system.class';
import { ReadFileResultStatus } from '../types/read-file-result-status.enum';
import { ReadFileError } from '../types/read-file-error.interface';
import { JsonFile } from 'src/file/json-file.class';
import { readPathMetadata } from './read-path-metadata.function';
import { readFile } from './read-file.function';

export const readJsonFile = (fileSystem: FileSystem) => (path: string) =>
  readPathMetadata(fileSystem)(path)
    .pipe(mergeMap(() => readFile(fileSystem)(path)))
    .pipe(
      map((result) =>
        result.status === ReadFileResultStatus.Success
          ? new JsonFile(
              result.path,
              JSON.parse(result.data),
              result.modifiedDate,
            )
          : result,
      ),
      catchError((error: unknown) =>
        of({
          status: ReadFileResultStatus.Error,
          message: error?.toString(),
        } as ReadFileError),
      ),
    );
