import { encryptBase64File } from '@chris.araneo/crypto';
import {
  Base64File,
  FileSystem,
  TextFile,
  TextFileReader,
  TextFileWriter,
} from '@chris.araneo/file-system';
import { chain } from 'lodash-es';
import { filter, map, Observable } from 'rxjs';

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

    const { encryptedContent } = encryptBase64File(path, content, secretKey);

    this.path = path;
    this.content = encryptedContent;
  }

  static fromBase64File(file: Base64File, secretKey: string): EncryptedFile {
    return new EncryptedFile(
      file.getPath(),
      file.getContent(),
      file.getModifiedDate(),
      secretKey,
    );
  }

  // TODO Refactor? Change name?
  static fromEncryptedFile(
    path: string,
    fileSystem: FileSystem = new FileSystem(),
  ): Observable<EncryptedFile> {
    return chain(new TextFileReader(fileSystem))
      .thru((reader) => reader.readFile(path))
      .thru((observable) => observable.pipe(
          filter((result) => result instanceof TextFile),
          map((result: TextFile) => chain(result)
              .thru((r: TextFile) => ({
                path: r.getPath(),
                content: r.getContent(),
                modifiedDate: r.getModifiedDate(),
              }))
              .thru(
                ({ path, content, modifiedDate }) => new EncryptedFile(
                    path,
                    content,
                    modifiedDate,
                    '',
                    fileSystem,
                  ),
              )
              .value(),
          ),
        ),
      )
      .value();
  }

  override writeToFile(): Observable<void> {
    return this.textFileWriter.writeFile(this);
  }
}
