import { CurrentDirectory } from './current-directory.class';

// Stryker disable all

export class CurrentDirectoryMock extends CurrentDirectory {
  override getCurrentDirectory(): string {
    return 'test-directory';
  }
}
