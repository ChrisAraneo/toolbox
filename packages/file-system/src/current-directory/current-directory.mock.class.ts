import { CurrentDirectory } from './current-directory.class';

// Stryker disable all

export class CurrentDirectoryMock extends CurrentDirectory {
  override getCurrentDirectory(): string {
    return 'root/mocks/file-system';
  }

  override getExtendedInfo(): object {
    return {
      dirname: 'root/mocks/file-system/dist/src/current-directory',
      filename:
        'root/mocks/file-system/dist/src/current-directory/current-directory.class.js',
      root: 'root/mocks',
      cwd: 'root/mocks/file-system',
    };
  }
}
