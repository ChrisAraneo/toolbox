import { catchError, from, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { TextFile } from '../../file/text-file.class';
import { FileSystem } from '../../file-system/file-system.class';
import { ReadFileResultStatus } from '../types/read-file-result-status.enum';
import {
  FILE_CONTENT_READING_ERROR_MESSAGE,
  FILE_METADATA_READING_ERROR_MESSAGE,
} from '../consts/file-reader.consts';
import { ReadFileError } from '../types/read-file-error.interface';
import { createErrorResult } from './create-error-read-file-result.function';
import { createSuccessResult } from './create-success-read-file-result.function';

export const readTextFile = (fileSystem: FileSystem) => (path: string) =>
  from(fileSystem.stat(path))
    .pipe(
      catchError((error: unknown) =>
        createErrorResult(FILE_METADATA_READING_ERROR_MESSAGE, path, error),
      ),
      mergeMap(() =>
        from(fileSystem.readFile(path, 'utf-8')).pipe(
          map((data) => createSuccessResult(path, data, new Date())),
          catchError((error: unknown) =>
            createErrorResult(FILE_CONTENT_READING_ERROR_MESSAGE, path, error),
          ),
        ),
      ),
    )
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
