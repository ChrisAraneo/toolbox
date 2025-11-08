import { writePatternsFile } from './write-patterns-file.function';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('node:fs');

jest.mock('fs', () => ({
  writeFile: jest.fn(),
}));

describe('writePatternsFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve when the file is written successfully', async () => {
    fs.writeFile.mockImplementation(
      (
        _path: unknown,
        _data: unknown,
        _encoding: unknown,
        callback: (any: unknown) => void,
      ) => {
        callback(null);
      },
    );

    const path = 'test.txt';
    const patterns = ['pattern1', 'pattern2', 'pattern3'];

    await expect(writePatternsFile(path, patterns)).resolves.toBeUndefined();
  });

  it('should reject when there is an error writing the file', async () => {
    fs.writeFile.mockImplementation(
      (
        _path: unknown,
        _data: unknown,
        _encoding: unknown,
        callback: (any: unknown) => void,
      ) => {
        callback(new Error('Write failed'));
      },
    );

    const path = 'test.txt';
    const patterns = ['pattern1', 'pattern2', 'pattern3'];

    await expect(writePatternsFile(path, patterns)).rejects.toThrow(
      'Write failed',
    );

    expect(fs.writeFile).toHaveBeenCalledWith(
      path,
      'pattern1\npattern2\npattern3\n',
      'utf8',
      expect.any(Function),
    );
  });

  it('should write file with empty line at the end when called with patterns file', async () => {
    fs.writeFile.mockImplementation(
      (
        _path: unknown,
        _data: unknown,
        _encoding: unknown,
        callback: (any: unknown) => void,
      ) => {
        callback(null);
      },
    );

    await expect(
      writePatternsFile('test.txt', ['pattern1', 'pattern2', 'pattern3']),
    ).resolves.toBeUndefined();

    expect(fs.writeFile).toHaveBeenCalledWith(
      'test.txt',
      'pattern1\npattern2\npattern3\n',
      'utf8',
      expect.any(Function),
    );
  });

  it('should write file without empty patterns when called with array having empty patterns', async () => {
    fs.writeFile.mockImplementation(
      (
        _path: unknown,
        _data: unknown,
        _encoding: unknown,
        callback: (any: unknown) => void,
      ) => {
        callback(null);
      },
    );

    await expect(
      writePatternsFile('test.txt', [
        'pattern1',
        '',
        '',
        'pattern2',
        '',
        'pattern3',
      ]),
    ).resolves.toBeUndefined();

    expect(fs.writeFile).toHaveBeenCalledWith(
      'test.txt',
      'pattern1\npattern2\npattern3\n',
      'utf8',
      expect.any(Function),
    );
  });

  it('should write file with trimmed patterns when called with array having patterns with prefix or suffix whitespaces', async () => {
    fs.writeFile.mockImplementation(
      (
        _path: unknown,
        _data: unknown,
        _encoding: unknown,
        callback: (any: unknown) => void,
      ) => {
        callback(null);
      },
    );

    await expect(
      writePatternsFile('test.txt', [
        'pattern1 \n\r\t  \n',
        '\t \n\rpattern2',
        '  \n   pattern3   \r\t  ',
      ]),
    ).resolves.toBeUndefined();

    expect(fs.writeFile).toHaveBeenCalledWith(
      'test.txt',
      'pattern1\npattern2\npattern3\n',
      'utf8',
      expect.any(Function),
    );
  });
});
