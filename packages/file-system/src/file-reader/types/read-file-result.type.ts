import { ReadFileResultStatus } from './read-file-result-status.enum';
import { ReadFileError } from './read-file-error.type';

export type ReadFileResult =
  | {
      status: ReadFileResultStatus.Success;
      path: string;
      data: string;
      modifiedDate: Date;
    }
  | ReadFileError;
