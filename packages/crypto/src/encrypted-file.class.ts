import {
  Base64File,
  FileSystem,
  TextFile,
  TextFileReader,
  TextFileWriter,
} from '@chris.araneo/file-system';
import { chain } from 'lodash';
import { filter, map, Observable } from 'rxjs';
import { encryptBase64File } from './encrypt-base64-file';

const createEncryptedContent = (
  path: string,
  content: string,
  modifiedDate: Date,
  secretKey: string,
): { path: string; content: string } =>
  secretKey
    ? encryptBase64File(new Base64File(path, content, modifiedDate), secretKey)
    : { path, content };

export class EncryptedFile extends TextFile {
  protected override textFileWriter: TextFileWriter;
  protected textFileReader: TextFileReader;

  private constructor(
    protected override path: string,
    protected override content: string,
    protected override modifiedDate: Date,
    protected secretKey: string,
    protected override fileSystem: FileSystem = new FileSystem(),
  ) {
    super(path, content, modifiedDate);

    this.textFileWriter = new TextFileWriter(fileSystem);
    this.textFileReader = new TextFileReader(fileSystem);

    const result = createEncryptedContent(
      path,
      content,
      modifiedDate,
      secretKey,
    );
    this.path = result.path;
    this.content = result.content;
  }

  static fromBase64File(file: Base64File, secretKey: string): EncryptedFile {
    return chain(file)
      .thru((f: Base64File) => ({
        path: f.getPath(),
        content: f.getContent(),
        modifiedDate: f.getModifiedDate(),
        secretKey,
      }))
      .thru(
        ({ path, content, modifiedDate, secretKey }) =>
          new EncryptedFile(path, content, modifiedDate, secretKey),
      )
      .value() as EncryptedFile;
  }

  static fromEncryptedFile(
    path: string,
    fileSystem: FileSystem = new FileSystem(),
  ): Observable<EncryptedFile> {
    return chain(new TextFileReader(fileSystem))
      .thru((reader) => reader.readFile(path))
      .thru((observable) =>
        observable.pipe(
          filter((result) => result instanceof TextFile),
          map(
            (result: TextFile) =>
              chain(result)
                .thru((r: TextFile) => ({
                  path: r.getPath(),
                  content: r.getContent(),
                  modifiedDate: r.getModifiedDate(),
                }))
                .thru(
                  ({ path, content, modifiedDate }) =>
                    new EncryptedFile(
                      path,
                      content,
                      modifiedDate,
                      '',
                      fileSystem,
                    ),
                )
                .value() as EncryptedFile,
          ),
        ),
      )
      .value() as Observable<EncryptedFile>;
  }

  override writeToFile(): Observable<void> {
    return this.textFileWriter.writeFile(this);
  }
}
