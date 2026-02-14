import { catchError, map, Observable, of } from 'rxjs';

import { JsonFile } from '../../file/json-file.class';
import { FileSystem } from '../../file-system/file-system.class';
import { ReadFileResultStatus } from '../read-file-result-status.enum';
import {
  FILE_CONTENT_READING_ERROR_MESSAGE,
  FILE_METADATA_READING_ERROR_MESSAGE,
} from '../consts/file-reader.consts';
import { ReadFileError } from '../types/read-file-error.type';
import { ReadFileResult } from '../types/read-file-result.type';

export const readJsonFile =
  (fileSystem: FileSystem) =>
  (path: string): Observable<JsonFile | ReadFileError> => {
    return readFile(fileSystem, path, 'utf-8').pipe(
      map((result: ReadFileResult) => {
        if (result.status === ReadFileResultStatus.Success) {
          return new JsonFile(
            result.path,
            JSON.parse(result.data),
            result.modifiedDate,
          );
        }
        return result;
      }),
      catchError((error: unknown) =>
        of({
          status: ReadFileResultStatus.Error,
          message: error?.toString(),
        } as ReadFileError),
      ),
    );
  };

function readFile(
  fileSystem: FileSystem,
  path: string,
  encoding: BufferEncoding,
): Observable<ReadFileResult> {
  return new Observable((subscriber) => {
    fileSystem.stat(path, (error: unknown, stats) => {
      if (error) {
        subscriber.next({
          status: ReadFileResultStatus.Error,
          message: `${FILE_METADATA_READING_ERROR_MESSAGE} (${path}): ${JSON.stringify(error)}`,
        });
        subscriber.complete();
      } else {
        fileSystem.readFile(path, encoding, (error: unknown, data: string) => {
          if (error) {
            subscriber.next({
              status: ReadFileResultStatus.Error,
              message: `${FILE_CONTENT_READING_ERROR_MESSAGE} (${path}): ${JSON.stringify(
                error,
              )}`,
            });
            subscriber.complete();
          } else {
            subscriber.next({
              status: ReadFileResultStatus.Success,
              path,
              data,
              modifiedDate: new Date(stats.mtime),
            });
            subscriber.complete();
          }
        });
      }
    });
  });
}
