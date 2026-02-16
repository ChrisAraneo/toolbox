import { catchError, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { FileSystem } from '../../file-system/file-system.class';
import { ReadFileResultStatus } from '../types/read-file-result-status.enum';
import { ReadFileError } from '../types/read-file-error.interface';
import { readPathMetadata } from './read-path-metadata.function';
import { readFile } from './read-file.function';
import { Base64File } from 'src/file/base64-file.class';

export const readBase64File = (fileSystem: FileSystem) => (path: string) =>
  readPathMetadata(fileSystem)(path)
    .pipe(mergeMap(() => readFile(fileSystem)(path)))
    .pipe(
      map((result) =>
        result.status === ReadFileResultStatus.Success
          ? new Base64File(result.path, result.data, result.modifiedDate)
          : result,
      ),
      catchError((error: unknown) =>
        of({
          status: ReadFileResultStatus.Error,
          message: error?.toString(),
        } as ReadFileError),
      ),
    );
