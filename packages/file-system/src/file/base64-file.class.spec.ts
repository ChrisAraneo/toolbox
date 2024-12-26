import { lastValueFrom } from 'rxjs';

import { FileSystem } from '../file-system/file-system.class';
import { FileSystemMock } from '../file-system/file-system.mock.class';
import { Base64File } from './base64-file.class';

let fileSystem: FileSystem;

beforeEach(() => {
  fileSystem = new FileSystemMock();
});

describe('Base64File', () => {
  it('instance should be created', async () => {
    const file = new Base64File(
      'test.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-08'),
    );

    expect(file).toBeInstanceOf(Base64File);
  });

  it('#getPath should return correct path', async () => {
    const file = new Base64File(
      'directory/test.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-10'),
    );
    const path = file.getPath();

    expect(path).toBe('directory/test.txt');
  });

  it('#getPath should return correct path after change', async () => {
    const file = new Base64File(
      'directory/test.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-10'),
    );
    file.setPath('directory/changed.txt');

    expect(file.getPath()).toBe('directory/changed.txt');
  });

  it('#getFilename should return correct filename', async () => {
    const file = new Base64File(
      'directory/test.name.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-10'),
    );
    const path = file.getFilename();

    expect(path).toBe('test.name');
  });

  it('#setFilename should change filename', async () => {
    const file = new Base64File(
      'directory/test.name.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-13'),
    );
    const filename = file.getFilename();
    file.setFilename('test.name2', 'txt');
    const updated = file.getFilename();

    expect(filename).toBe('test.name');
    expect(updated).toBe('test.name2');
  });

  it('#setFilename should change filename without extension', async () => {
    const file = new Base64File(
      'directory/test.name.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-13'),
    );
    file.setFilename('test', null);

    expect(file.getFilename()).toBe('test');
  });

  it('#getExtension should return correct extension', async () => {
    const file = new Base64File(
      'directory/this.is.test.name.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-10'),
    );
    const extension = file.getExtension();

    expect(extension).toBe('txt');
  });

  it('#getExtension should return null', async () => {
    const file = new Base64File(
      'directory/no-extension',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-10'),
    );
    const extension = file.getExtension();

    expect(extension).toBe(null);
  });

  it('#getContent should return correct file content', async () => {
    const file = new Base64File(
      'directory/test.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-10'),
    );
    const content = file.getContent();

    expect(content).toBe('SGVsbG8gV29ybGQh');
  });

  it('#getHashValue should return correct hash value', async () => {
    const file = new Base64File(
      'directory/test.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-10'),
    );
    const hash = file.getHashValue();

    expect(hash).toBe('ca5a479cddd6308dcf42e76e232ca96a');
  });

  it('#getDate should return correct date', async () => {
    const file = new Base64File(
      'directory/test.txt',
      'SGVsbG8gV29ybGQh',
      new Date('2023-11-10'),
    );
    const date = file.getModifiedDate();

    expect(date.toISOString()).toBe('2023-11-10T00:00:00.000Z');
  });

  it('#fromFile should read file and create instance', async () => {
    const file = await lastValueFrom(
      Base64File.fromFile('test.txt', fileSystem),
    );

    expect(file).toBeInstanceOf(Base64File);
  });

  it('#writeToFile should write file', async () => {
    jest.spyOn(fileSystem, 'writeFile');
    const file = new Base64File(
      'test.txt',
      'Hello World!',
      new Date('2023-11-08'),
    );

    await lastValueFrom(file.writeToFile(fileSystem));

    const call = jest.mocked(fileSystem.writeFile).mock.calls[0];
    expect(call[0]).toBe('test.txt');
    expect(call[1]).toBe('Hello World!');
    expect(call[2]).toBe('base64');
    expect(typeof call[3]).toBe('function');
  });
});
