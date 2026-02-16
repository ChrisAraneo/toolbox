import { from, Observable } from 'rxjs';

import { FileSystem } from '../../file-system/file-system.class';

export const getDirectoryContents =
  (fileSystem: FileSystem) =>
  (directory: string): Observable<string[]> =>
    from(fileSystem.readdir(directory));
