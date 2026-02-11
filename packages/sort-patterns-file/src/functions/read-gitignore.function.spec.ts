import fs from 'node:fs';
import { normalize, sep } from 'node:path';

import { readGitignore } from './read-gitignore.function';

jest.mock('fs', () => ({
  readFile: jest.fn(),
}));

jest.mock('node:path', () => ({
  ...jest.requireActual('node:path'),
  normalize: jest.fn((path) => path),
}));

describe('readGitignore', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should resolve with entries from .gitignore', async () => {
    const content = 'node_modules\ndist\ncoverage\n';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, content);
      },
    );

    const result = await readGitignore();

    expect(result).toEqual(['node_modules', 'dist', 'coverage']);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ignoring 3 entries from .gitignore',
    );
  });

  it('should resolve with an empty array if .gitignore does not exist', async () => {
    const error = new Error('ENOENT: no such file or directory');
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(error, '');
      },
    );

    const result = await readGitignore();

    expect(result).toEqual([]);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should resolve with an empty array when error is truthy and not process data', async () => {
    const error = new Error('Permission denied');
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(error, 'node_modules\ndist\n');
      },
    );

    const result = await readGitignore();

    expect(result).toEqual([]);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should filter out comment lines starting with #', async () => {
    const content = '# Build output\ndist\n# Dependencies\nnode_modules\n';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, content);
      },
    );

    const result = await readGitignore();

    expect(result).toEqual(['dist', 'node_modules']);
  });

  it('should filter out empty lines', async () => {
    const content = '\nnode_modules\n\n\ndist\n\n';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, content);
      },
    );

    const result = await readGitignore();

    expect(result).toEqual(['node_modules', 'dist']);
  });

  it('should trim whitespace from entries', async () => {
    const content = '  node_modules  \n  dist\n   coverage   \n';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, content);
      },
    );

    const result = await readGitignore();

    expect(result).toEqual(['node_modules', 'dist', 'coverage']);
  });

  it('should filter out lines that are only whitespace', async () => {
    const content = 'node_modules\n   \n  \t  \ndist\n';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, content);
      },
    );

    const result = await readGitignore();

    expect(result).toEqual(['node_modules', 'dist']);
  });

  it('should call readFile with utf8 encoding', async () => {
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, '');
      },
    );

    await readGitignore();

    expect(fs.readFile).toHaveBeenCalledWith(
      expect.any(String),
      'utf8',
      expect.any(Function),
    );
  });

  it('should construct the path using process.cwd() and .gitignore', async () => {
    const mockCwd = String.raw`C:\Users\test\project`;
    const expectedNormalizeArg = `${mockCwd + sep}.gitignore`;

    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    (normalize as jest.Mock).mockImplementation((path) => path);
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (path, _, callback) => {
        expect(path).toContain(mockCwd);
        expect(path).toContain('.gitignore');
        callback(null, '');
      },
    );

    await readGitignore();

    expect(normalize).toHaveBeenCalledWith(expectedNormalizeArg);
    cwdSpy.mockRestore();
  });

  it('should resolve with an empty array for an empty .gitignore file', async () => {
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, '');
      },
    );

    const result = await readGitignore();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ignoring 0 entries from .gitignore',
    );
  });

  it('should handle a .gitignore with only comments and empty lines', async () => {
    const content = '# Comment 1\n# Comment 2\n\n# Another comment\n';
    (fs.readFile as unknown as jest.Mock).mockImplementation(
      (_, __, callback) => {
        callback(null, content);
      },
    );

    const result = await readGitignore();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ignoring 0 entries from .gitignore',
    );
  });
});
