import { readPatternsFile } from './read-patterns-file.function';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

jest.mock('fs', () => ({
  readFile: jest.fn(),
}));

describe('readPatternsFile', () => {
  it('should resolve with the correct array of lines from the file', async () => {
    const content = 'pattern1\npattern2\npattern3\r\n';
    (fs.readFile as jest.Mock).mockImplementation((_, __, callback) => {
      callback(null, content);
    });

    const result = await readPatternsFile('test-patterns.txt');

    expect(result).toEqual(['pattern1', 'pattern2', 'pattern3']);
  });

  it('should reject with an error if readFile fails', async () => {
    const error = new Error('File not found');
    (fs.readFile as jest.Mock).mockImplementation((_, __, callback) =>
      callback(error, ''),
    );

    try {
      await readPatternsFile('test-patterns.txt');
    } catch (error) {
      expect(error).toEqual(error);
    }
  });

  it('should ignore empty lines and lines with only \\r or \\n characters', async () => {
    const content = '\n\npattern1\n\npattern2\n\r\n\r\n';
    (fs.readFile as jest.Mock).mockImplementation((_, __, callback) =>
      callback(null, content),
    );

    const result = await readPatternsFile('test-patterns.txt');

    expect(result).toEqual(['pattern1', 'pattern2']);
  });

  it('should handle \\r and \\n characters correctly', async () => {
    const content = 'pattern1\r\npattern2\npattern3\r';
    (fs.readFile as jest.Mock).mockImplementation((_, __, callback) =>
      callback(null, content),
    );

    const result = await readPatternsFile('test-patterns.txt');

    expect(result).toEqual(['pattern1', 'pattern2', 'pattern3']);
  });
});
