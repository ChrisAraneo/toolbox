import { normalize } from 'node:path';

import { Logger } from '@chris.araneo/logger';
import { isString } from 'lodash';
import { catchError, forkJoin, Observable, of, shareReplay } from 'rxjs';

import { FileSystem } from '../file-system/file-system.class';
import { FindFileResult } from './find-file-result.type';

export class FileFinder {
  constructor(
    private fileSystem: FileSystem = new FileSystem(),
    private logger?: Logger,
  ) {}

  findFile(
    pattern: string | RegExp,
    root: string,
    fileSystem: FileSystem = new FileSystem(),
  ): Observable<FindFileResult> {
    const _pattern: RegExp = isString(pattern)
      ? new RegExp(pattern.replace('/i', '\\/i'), 'i')
      : pattern;

    return new Observable<FindFileResult>((subscriber) => {
      if (!this.fileSystem.existsSync(root)) {
        subscriber.next(
          this.createFindFileResult({
            success: false,
            pattern: _pattern,
            root,
            result: [],
            message: `Root doesn't exist: ${root}`,
          }),
        );
        subscriber.complete();

        return;
      }

      fileSystem
        .findFile(_pattern, root, (result: string[]) => {
          subscriber.next(
            this.createFindFileResult({
              success: true,
              pattern: _pattern,
              root,
              result: result,
              message: null,
            }),
          );
          subscriber.complete();
        })
        // Stryker disable all : Ignore file system errors like "Error: EBUSY: resource busy or locked"
        .error((error: unknown) => {
          if (this.logger) {
            this.logger.debug(
              `${JSON.stringify(error, Object.getOwnPropertyNames(error))}`,
            );
          }
        });
      // Stryker restore all
    }).pipe(
      catchError((error: unknown) => {
        return of(
          this.createFindFileResult({
            success: false,
            pattern: _pattern,
            root,
            result: [],
            message: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          }),
        );
      }),
      shareReplay(1),
    );
  }

  findFiles(
    pattern: string | RegExp,
    roots: string[],
    fileSystem: FileSystem = new FileSystem(),
  ): Observable<FindFileResult[]> {
    return forkJoin(
      roots.map((root: string) => {
        return this.findFile(pattern, root, fileSystem);
      }),
    );
  }

  private createFindFileResult(input: {
    success: boolean;
    pattern: RegExp;
    root: string;
    result: string[];
    message: string | null;
  }): FindFileResult {
    const _pattern = input.pattern.toString();
    const pattern = input.pattern
      .toString()
      .substring(
        _pattern.indexOf('/i') === _pattern.length - 2 ? 1 : 0,
        _pattern.length,
      )
      .replace(new RegExp('/i$'), '');

    const root = normalize(input.root);

    const result = input.result.map((item) => {
      const path = item
        .toString()
        .substring(item.indexOf('/i') === item.length - 2 ? 1 : 0, item.length)
        .replace(new RegExp('/i$'), '');

      return this.fixIncorrectResultPathPrefix(path, root);
    });

    return {
      success: input.success,
      pattern: pattern,
      root: root,
      result: result,
      message: input.message,
    };
  }

  private fixIncorrectResultPathPrefix(path: string, root: string): string {
    if (path.startsWith(root)) {
      return path;
    } else {
      const rootParts = root.split('\\');
      const pathParts = path.split('\\');

      if (pathParts[0].startsWith(rootParts[0] + rootParts[1])) {
        pathParts[0] = rootParts[1];
        pathParts.unshift(rootParts[0]);

        return pathParts.join('\\');
      }

      return path;
    }
  }
}
