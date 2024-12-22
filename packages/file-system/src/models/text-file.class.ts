import { Observable } from 'rxjs';
import { FileSystem } from 'src/file-system/file-system.class';
import { TextFileWriter } from 'src/file-writer/text-file-writer.class';

import { File } from './file.class';

export class TextFile extends File<string> {
  protected textFileWriter: TextFileWriter;

  constructor(
    protected override path: string,
    protected override content: string,
    protected override modifiedDate: Date,
    protected fileSystem: FileSystem = new FileSystem(),
  ) {
    super(path, content, modifiedDate);
    this.textFileWriter = new TextFileWriter(fileSystem);
  }

  writeToFile(): Observable<void> {
    return this.textFileWriter.writeFile(this);
  }
}
