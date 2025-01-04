import { PathOrFileDescriptor, Stats } from 'fs';
import { lastValueFrom as firstValueFrom } from 'rxjs';

import { JsonFile } from '../file/json-file.class';
import { FileSystem } from '../file-system/file-system.class';
import { FileSystemMock } from '../file-system/file-system.mock.class';
import { JsonFileReader } from './json-file-reader.class';

let fileSystem: FileSystem;
let reader: JsonFileReader;

beforeEach(() => {
  fileSystem = new FileSystemMock();
  reader = new JsonFileReader(fileSystem);
});

describe('JsonFileReader', () => {
  it('#readFile should read a text file', async () => {
    jest.spyOn(fileSystem, 'readFile');

    const result = await firstValueFrom(reader.readFile('test.json'));
    const call = jest.mocked(fileSystem.readFile).mock.calls[0];

    expect(call[0]).toBe('test.json');
    expect(call[1]).toBe('utf-8');
    expect(typeof call[2]).toBe('function');
    expect(result).toBeInstanceOf(JsonFile);
    expect((result as JsonFile).getFilename()).toBe('test');
    expect((result as JsonFile).getModifiedDate()).toStrictEqual(
      new Date('2023-10-27T21:33:39.661Z'),
    );
    expect((result as JsonFile).getContent()).toStrictEqual({ name: 'Joel' });
  });

  it('#readFiles should read text files', async () => {
    jest.spyOn(fileSystem, 'readFile');

    const result = await firstValueFrom(
      reader.readFiles(['test.json', 'test2.json', 'test3.json']),
    );

    const calls = jest.mocked(fileSystem.readFile).mock.calls;
    expect(calls.length).toBe(3);
    result.forEach((value) => {
      expect(value).toBeInstanceOf(JsonFile);
    });
  });

  it('#readFile should return error object when file system calls callback with error on file read', async () => {
    fileSystem = new ReadFileErrorCallbackMock();
    reader = new JsonFileReader(fileSystem);

    const result = await firstValueFrom(reader.readFile('test.txt'));

    expect(result).toStrictEqual({
      message: 'Error while reading file content (test.txt): "error"',
      status: 'error',
    });
  });

  it('#readFile should return error object when file system throws error on file read', async () => {
    fileSystem = new ReadFileThrowErrorMock();
    reader = new JsonFileReader(fileSystem);

    const result = await firstValueFrom(reader.readFile('test.txt'));

    expect(result).toStrictEqual({
      message: 'Error: Mock error',
      status: 'error',
    });
  });

  it('#readFile should return error object when file system calls callback with error on meta-data check', async () => {
    fileSystem = new MetaDataErrorCallbackMock();
    reader = new JsonFileReader(fileSystem);

    const result = await firstValueFrom(reader.readFile('test.txt'));

    expect(result).toStrictEqual({
      message: 'Error while reading file metadata (test.txt): "error"',
      status: 'error',
    });
  });

  it('#readFile should return error object when file system throws error on meta-data check', async () => {
    fileSystem = new MetaDataThrowErrorMock();
    reader = new JsonFileReader(fileSystem);

    const result = await firstValueFrom(reader.readFile('test.txt'));

    expect(result).toStrictEqual({
      message: 'Error: Mock error',
      status: 'error',
    });
  });
});

class ReadFileErrorCallbackMock extends FileSystemMock {
  override readFile(
    _path: PathOrFileDescriptor,
    _options:
      | ({
          encoding: BufferEncoding;
          flag?: string | undefined;
        } & unknown)
      | BufferEncoding,
    callback: (err: NodeJS.ErrnoException | null, data: string) => void,
  ): void {
    callback(
      'error' as unknown as NodeJS.ErrnoException,
      null as unknown as string,
    );
  }
}

class ReadFileThrowErrorMock extends FileSystemMock {
  override readFile(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _path: PathOrFileDescriptor,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options:
      | ({
          encoding: BufferEncoding;
          flag?: string | undefined;
        } & unknown)
      | BufferEncoding,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _callback: (err: NodeJS.ErrnoException | null, data: string) => void,
  ): void {
    throw Error('Mock error');
  }
}

class MetaDataErrorCallbackMock extends FileSystemMock {
  override stat(
    _path: string,
    callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void,
  ): void {
    callback(
      'error' as unknown as NodeJS.ErrnoException,
      {} as unknown as Stats,
    );
  }
}

class MetaDataThrowErrorMock extends FileSystemMock {
  override stat(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _path: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void,
  ): void {
    throw Error('Mock error');
  }
}
