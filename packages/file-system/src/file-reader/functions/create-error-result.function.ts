import { Observable, of } from 'rxjs';

import { ReadFileResult } from '../types/read-file-result.type';
import { ReadFileResultStatus } from '../types/read-file-result-status.enum';

export const createErrorResult = (
  message: string,
  path: string,
  error: unknown,
): Observable<ReadFileResult> => of({
    status: ReadFileResultStatus.Error,
    message: `${message} (${path}): ${JSON.stringify(error)}`,
  });
