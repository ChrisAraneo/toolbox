import { TextFile } from '../file/text-file.class';
import { FileSystem } from '../file-system/file-system.class';
import { FileWriter } from './file-writer.class';

export class TextFileWriter extends FileWriter<TextFile> {
  constructor(protected override fileSystem: FileSystem) {
    super(fileSystem, 'utf-8');
  }
}
