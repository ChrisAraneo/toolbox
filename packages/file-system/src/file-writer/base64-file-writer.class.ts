import { Base64File } from '../file/base64-file.class';
import { FileSystem } from '../file-system/file-system.class';
import { FileWriter } from './file-writer.class';

export class Base64FileWriter extends FileWriter<Base64File> {
  constructor(protected override fileSystem: FileSystem) {
    super(fileSystem, 'base64');
  }
}
