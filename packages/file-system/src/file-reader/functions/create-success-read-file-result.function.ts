import { ReadFileResultStatus } from '../types/read-file-result-status.enum';
import { ReadFileResult } from '../types/read-file-result.type';

export const createSuccessResult = (
  path: string,
  data: string,
  modifiedDate: Date,
): ReadFileResult => {
  return {
    status: ReadFileResultStatus.Success,
    path,
    data,
    modifiedDate,
  };
};
