import { catchError, from } from 'rxjs';
import { FileSystem } from 'src/file-system/file-system.class';
import { createErrorResult } from './create-error-read-file-result.function';
import { FILE_METADATA_READING_ERROR_MESSAGE } from '../consts/file-reader.consts';

export const readPathMetadata = (fileSystem: FileSystem) => (path: string) =>
  from(fileSystem.stat(path)).pipe(
    catchError((error: unknown) =>
      createErrorResult(FILE_METADATA_READING_ERROR_MESSAGE, path, error),
    ),
  );
