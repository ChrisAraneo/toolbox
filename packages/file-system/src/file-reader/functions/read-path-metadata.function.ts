import { catchError, from } from 'rxjs';

import { FileSystem } from '../../file-system/file-system.class';
import { FILE_METADATA_READING_ERROR_MESSAGE } from '../consts/file-reader.consts';
import { createErrorResult } from './create-error-result.function';

export const readPathMetadata = (fileSystem: FileSystem) => (path: string) => from(fileSystem.stat(path)).pipe(
    catchError((error: unknown) => createErrorResult(FILE_METADATA_READING_ERROR_MESSAGE, path, error),
    ),
  );
