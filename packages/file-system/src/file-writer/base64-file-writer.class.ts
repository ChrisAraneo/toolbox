import { FileSystem } from '../file-system/file-system.class';
import { Base64File } from '../models/base64-file.class';
import { FileWriter } from './file-writer.class';

export class Base64FileWriter extends FileWriter<Base64File> {
  constructor(protected override fileSystem: FileSystem) {
    super(fileSystem, 'base64');
  }
}
