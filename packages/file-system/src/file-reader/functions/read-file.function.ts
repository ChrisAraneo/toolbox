import { catchError, from, map } from 'rxjs';
import { FileSystem } from '../../file-system/file-system.class';

import { FILE_CONTENT_READING_ERROR_MESSAGE } from '../consts/file-reader.consts';
import { createErrorResult } from './create-error-result.function';
import { createSuccessResult } from './create-success-result.function';

export const readFile = (fileSystem: FileSystem) => (path: string) =>
  from(fileSystem.readFile(path, 'utf-8')).pipe(
    map((data) => createSuccessResult(path, String(data), new Date())),
    catchError((error: unknown) =>
      createErrorResult(FILE_CONTENT_READING_ERROR_MESSAGE, path, error),
    ),
  );
