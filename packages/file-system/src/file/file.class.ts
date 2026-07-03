import path from 'node:path';

import { includes, initial, last, max } from 'lodash-es';
import md5 from 'md5';
import { match, P } from 'ts-pattern';

const { when } = P;

export abstract class File<T> {
  private hashValue!: string;

  constructor(
    protected path: string,
    protected content: T,
    protected modifiedDate: Date,
  ) {
    this.setHashValue(content);
  }

  getPath(): string {
    return this.path;
  }

  getFilename(): string {
    const basename = path.basename(this.path);

    return match(basename)
      .with(
        when((value: string) => includes(value, '.')),
        (value) => initial(value.split('.')).join('.'),
      )
      .otherwise((value) => value);
  }

  getExtension(): string | null {
    const parts = path.basename(this.path).split('.');

    return match(parts)
      .with(
        when((value: string[]) => value.length < 2),
        () => null,
      )
      .otherwise((value) => last(value) ?? null);
  }

  getContent(): T {
    return this.content;
  }

  getHashValue(): string {
    return this.hashValue;
  }

  getModifiedDate(): Date {
    return this.modifiedDate;
  }

  setFilename(
    filename: string,
    extension: string | null = this.getExtension(),
  ): void {
    const basename = path.basename(this.path);
    const basenameIndex = this.path.lastIndexOf(basename);
    const extensionSuffix = match(extension)
      .with(when(Boolean), (value) => `.${value}`)
      .otherwise(() => '');

    this.path =
      this.path.slice(0, max([0, basenameIndex])) + filename + extensionSuffix;
  }

  setPath(path: string): void {
    this.path = path;
  }

  private setHashValue(content: T): void {
    this.hashValue = md5(content?.toString() ?? '');
  }
}
