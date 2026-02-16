import { ReadFileResultStatus } from '../types/read-file-result-status.enum';
import { ReadFileResult } from '../types/read-file-result.type';
import { Observable, of } from 'rxjs';

export const createErrorResult = (
  message: string,
  path: string,
  error: unknown,
): Observable<ReadFileResult> => {
  return of({
    status: ReadFileResultStatus.Error,
    message: `${message} (${path}): ${JSON.stringify(error)}`,
  });
};
