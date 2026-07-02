import { ReadFileResult } from '../types/read-file-result.type';
import { ReadFileResultStatus } from '../types/read-file-result-status.enum';

export const createSuccessResult = (
  path: string,
  data: string,
  modifiedDate: Date,
): ReadFileResult => ({
  status: ReadFileResultStatus.Success,
  path,
  data,
  modifiedDate,
});
