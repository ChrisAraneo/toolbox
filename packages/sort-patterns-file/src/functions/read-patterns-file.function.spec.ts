import fs from 'node:fs';
import { sep } from 'node:path';

import { readPatternsFile } from './read-patterns-file.function';

jest.mock('fs', () => ({
  readFile: jest.fn(),
}));

describe('readPatternsFile', () => {
  it('should resolve with the correct array of lines from the file', async () => {
    const content = 'pattern1\npattern2\npattern3\r\n';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, content);
      },
    );

    const result = await readPatternsFile('test-patterns.txt');

    expect(result).toEqual(['pattern1', 'pattern2', 'pattern3']);
  });

  it('should reject with an error if readFile fails', async () => {
    const error = new Error('File not found');
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => callback(error, ''),
    );

    try {
      await readPatternsFile('test-patterns.txt');
    } catch (error_: unknown) {
      expect(error_).toEqual(error);
    }
  });

  it('should reject the promise when readFile encounters an error', async () => {
    const error = new Error('Permission denied');
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => callback(error, ''),
    );

    await expect(readPatternsFile('test-patterns.txt')).rejects.toThrow(
      'Permission denied',
    );
  });

  it(
    String.raw`should ignore empty lines and lines with only \r or \n characters`,
    async () => {
      const content = '\n\npattern1\n\npattern2\n\r\n\r\n';
      (fs.readFile as unknown as jest.Mock).mockImplementation(
        (_, __, callback) => callback(null, content),
      );

      const result = await readPatternsFile('test-patterns.txt');

      expect(result).toEqual(['pattern1', 'pattern2']);
    },
  );

  it(String.raw`should handle \r and \n characters correctly`, async () => {
    const content = 'pattern1\r\npattern2\n\n\n\npattern3\r\n';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => callback(null, content),
    );

    const result = await readPatternsFile('test-patterns.txt');

    expect(result).toEqual(['pattern1', 'pattern2', 'pattern3']);
  });

  it('should call readFile with utf8 encoding', async () => {
    const content = 'pattern1\npattern2\n\npattern3';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => callback(null, content),
    );

    await readPatternsFile('test-patterns.txt');

    expect(fs.readFile).toHaveBeenCalledWith(
      expect.any(String),
      'utf8',
      expect.any(Function),
    );
  });

  it('should construct file path using process.cwd() and path separator', async () => {
    const content = 'pattern1\npattern2';
    const mockCwd = String.raw`C:\Users\test\project`;

    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (path, _, callback) => {
        expect(path).toContain(mockCwd);
        expect(path).toContain(sep);
        expect(path).toContain('patterns.txt');
        callback(null, content);
      },
    );

    await readPatternsFile('patterns.txt');

    expect(fs.readFile).toHaveBeenCalled();
    cwdSpy.mockRestore();
  });
});
