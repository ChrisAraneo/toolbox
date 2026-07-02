import { ReadFileError } from './read-file-error.interface';
import { ReadFileResultStatus } from './read-file-result-status.enum';

export type ReadFileResult =
  | {
      status: ReadFileResultStatus.Success;
      path: string;
      data: string;
      modifiedDate: Date;
    }
  | ReadFileError;
