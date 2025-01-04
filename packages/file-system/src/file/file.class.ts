import md5 from 'md5';
import path from 'path';

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

    if (!basename.includes('.')) {
      return basename;
    }

    const parts = basename.split('.');
    parts.pop();

    return parts.join('.');
  }

  getExtension(): string | null {
    const basename = path.basename(this.path);
    const parts = basename.split('.');

    if (parts.length < 2) {
      return null;
    }

    return parts[parts.length - 1];
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

    this.path =
      this.path.substring(0, basenameIndex) +
      filename +
      (extension ? '.' + extension : '');
  }

  setPath(path: string): void {
    this.path = path;
  }

  private setHashValue(content: T): void {
    this.hashValue = md5(content?.toString() || '');
  }
}
