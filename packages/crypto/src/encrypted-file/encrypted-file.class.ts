import {
  Base64File,
  FileSystem,
  TextFile,
  TextFileReader,
  TextFileWriter,
} from '@chris.araneo/file-system';
import { filter, map, Observable } from 'rxjs';
import { FileEncryptor } from 'src/file-encryptor/file-encryptor.class';

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

    if (secretKey) {
      const result = FileEncryptor.encryptBase64File(
        new Base64File(path, content, modifiedDate),
        secretKey,
      );

      this.path = result.path;
      this.content = result.content;
    }
  }

  static fromBase64File(file: Base64File, secretKey: string): EncryptedFile {
    return new EncryptedFile(
      file.getPath(),
      file.getContent(),
      file.getModifiedDate(),
      secretKey,
    );
  }

  static fromEncryptedFile(
    path: string,
    fileSystem: FileSystem = new FileSystem(),
  ): Observable<EncryptedFile> {
    return new TextFileReader(fileSystem).readFile(path).pipe(
      filter((result) => result instanceof TextFile),
      map(
        (result: TextFile) =>
          new EncryptedFile(
            result.getPath(),
            result.getContent(),
            result.getModifiedDate(),
            '',
            fileSystem,
          ),
      ),
    );
  }

  override writeToFile(): Observable<void> {
    return this.textFileWriter.writeFile(this);
  }
}
