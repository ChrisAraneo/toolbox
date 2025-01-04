import { PathOrFileDescriptor, Stats } from 'fs';
import { lastValueFrom } from 'rxjs';

import { FileSystem } from '../file-system/file-system.class';
import { FileSystemMock } from '../file-system/file-system.mock.class';
import { TextFileReader } from './text-file-reader.class';

let fileSystem: FileSystem;
let reader: TextFileReader;

beforeEach(() => {
  fileSystem = new FileSystemMock();
  reader = new TextFileReader(fileSystem);
});

describe('TextFileReader', () => {
  it('#readFile should read a text file', async () => {
    jest.spyOn(fileSystem, 'readFile');

    await lastValueFrom(reader.readFile('test.txt'));

    const call = jest.mocked(fileSystem.readFile).mock.calls[0];
    expect(call[0]).toBe('test.txt');
    expect(call[1]).toBe('utf-8');
    expect(typeof call[2]).toBe('function');
  });

  it('#readFiles should read text files', async () => {
    jest.spyOn(fileSystem, 'readFile');

    await lastValueFrom(
      reader.readFiles(['test.txt', 'test2.txt', 'test3.txt']),
    );

    const calls = jest.mocked(fileSystem.readFile).mock.calls;
    expect(calls.length).toBe(3);
  });

  it('#readFile should return error object when file system throw error on file read', async () => {
    fileSystem = new ReadFileErrorMock();
    reader = new TextFileReader(fileSystem);

    const result = await lastValueFrom(reader.readFile('test.txt'));

    expect(result).toStrictEqual({
      message: 'Error while reading file content (test.txt): "error"',
      status: 'error',
    });
  });

  it('#readFile should return error object when file system throw error on meta-data check', async () => {
    fileSystem = new StatErrorMock();
    reader = new TextFileReader(fileSystem);

    const result = await lastValueFrom(reader.readFile('test.txt'));

    expect(result).toStrictEqual({
      message: 'Error while reading file metadata (test.txt): "error"',
      status: 'error',
    });
  });
});

class ReadFileErrorMock extends FileSystemMock {
  override readFile(
    path: PathOrFileDescriptor,
    options:
      | ({
          encoding: BufferEncoding;
          flag?: string | undefined;
        } & unknown)
      | BufferEncoding,
    callback: (err: NodeJS.ErrnoException | null, data: string) => void,
  ): void {
    callback('error' as unknown as NodeJS.ErrnoException, '');
  }
}

class StatErrorMock extends FileSystemMock {
  override stat(
    path: string,
    callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void,
  ): void {
    callback(
      'error' as unknown as NodeJS.ErrnoException,
      {} as unknown as Stats,
    );
  }
}
