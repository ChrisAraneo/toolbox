import { catchError, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { FileSystem } from '../../file-system/file-system.class';
import { ReadFileResultStatus } from '../types/read-file-result-status.enum';
import { ReadFileError } from '../types/read-file-error.interface';
import { readPathMetadata } from './read-path-metadata.function';
import { readFile } from './read-file.function';
import { TextFile } from 'src/file/text-file.class';

export const readTextFile = (fileSystem: FileSystem) => (path: string) =>
  readPathMetadata(fileSystem)(path)
    .pipe(mergeMap(() => readFile(fileSystem)(path)))
    .pipe(
      map((result) =>
        result.status === ReadFileResultStatus.Success
          ? new TextFile(result.path, result.data, result.modifiedDate)
          : result,
      ),
      catchError((error: unknown) =>
        of({
          status: ReadFileResultStatus.Error,
          message: error?.toString(),
        } as ReadFileError),
      ),
    );
