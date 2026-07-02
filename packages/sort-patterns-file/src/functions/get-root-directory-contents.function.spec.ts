import { glob } from 'glob';
import { FileSystemNode } from 'src/interfaces/file-system-node.interface';

import { createFileSystemNodeMap } from './create-file-system-node-map.function';
import { createFileSystemPathInfos } from './create-file-system-path-infos.function';
import { createOrganizedFileSystemNodeArray } from './create-organized-file-system-node-array.function';
import { getRootDirectoryContents } from './get-root-directory-contents.function';
import { getTimeDiff } from './get-time-diff.function';

jest.mock('glob');
jest.mock('just-performance', () => ({
  performance: {
    now: jest.fn(),
  },
}));
jest.mock('./create-file-system-path-infos.function');
jest.mock('./create-file-system-node-map.function');
jest.mock('./create-organized-file-system-node-array.function');
jest.mock('./get-time-diff.function');

describe('getRootDirectoryContents', () => {
  let mockGlob: jest.MockedFunction<typeof glob>;
  let mockCreateFileSystemPathInfos: jest.MockedFunction<
    typeof createFileSystemPathInfos
  >;
  let mockCreateFileSystemNodeMap: jest.MockedFunction<
    typeof createFileSystemNodeMap
  >;
  let mockCreateOrganizedFileSystemNodeArray: jest.MockedFunction<
    typeof createOrganizedFileSystemNodeArray
  >;
  let mockGetTimeDiff: jest.MockedFunction<typeof getTimeDiff>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGlob = glob as jest.MockedFunction<typeof glob>;
    mockCreateFileSystemPathInfos =
      createFileSystemPathInfos as jest.MockedFunction<
        typeof createFileSystemPathInfos
      >;
    mockCreateFileSystemNodeMap =
      createFileSystemNodeMap as jest.MockedFunction<
        typeof createFileSystemNodeMap
      >;
    mockCreateOrganizedFileSystemNodeArray =
      createOrganizedFileSystemNodeArray as jest.MockedFunction<
        typeof createOrganizedFileSystemNodeArray
      >;
    mockGetTimeDiff = getTimeDiff as jest.MockedFunction<typeof getTimeDiff>;

    const { performance } = jest.requireMock('just-performance');
    (performance.now as jest.Mock).mockReturnValue(1000);
    mockGetTimeDiff.mockReturnValue('15.234');
  });

  it('should return file system nodes for root directory', async () => {
    const ignoredDirectories = ['node_modules'];
    const mockGlobResult = ['src/index.ts', 'src/main.ts'];
    const mockPathInfos = [
      { path: 'src/index.ts', isFile: true, isDirectory: false },
      { path: 'src/main.ts', isFile: true, isDirectory: false },
    ];
    const mockNodeMap = {
      src: { name: 'src', parentDirectory: null, files: ['src/index.ts'] },
    };
    const mockNodes: FileSystemNode[] = [
      { name: 'src', parentDirectory: null, files: ['src/index.ts'] },
    ];

    mockGlob.mockResolvedValue(mockGlobResult);
    mockCreateFileSystemPathInfos.mockReturnValue(mockPathInfos);
    mockCreateFileSystemNodeMap.mockReturnValue(mockNodeMap);
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue(mockNodes);

    const result = await getRootDirectoryContents(ignoredDirectories, {
      withCache: false,
    });

    expect(result).toEqual(mockNodes);
  });

  it('should call glob with correct ignore patterns', async () => {
    const ignoredDirectories = ['node_modules', 'dist', '.git'];
    const mockGlobResult = ['src/index.ts'];

    mockGlob.mockResolvedValue(mockGlobResult);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    await getRootDirectoryContents(ignoredDirectories, { withCache: false });

    expect(mockGlob).toHaveBeenCalledWith('**', {
      ignore: ['node_modules/**', 'dist/**', '.git/**'],
      dot: true,
      dotRelative: true,
    });
  });

  it('should concatenate glob results with ignored directories', async () => {
    const ignoredDirectories = ['node_modules', 'dist'];
    const mockGlobResult = ['src/index.ts', 'lib/main.ts'];

    mockGlob.mockResolvedValue(mockGlobResult);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    await getRootDirectoryContents(ignoredDirectories, { withCache: false });

    expect(mockCreateFileSystemPathInfos).toHaveBeenCalledWith([
      'src/index.ts',
      'lib/main.ts',
      'node_modules',
      'dist',
    ]);
  });

  it('should call createFileSystemNodeMap with path infos', async () => {
    const ignoredDirectories = ['node_modules'];
    const mockPathInfos = [
      { path: 'src/index.ts', isFile: true, isDirectory: false },
    ];

    mockGlob.mockResolvedValue([]);
    mockCreateFileSystemPathInfos.mockReturnValue(mockPathInfos);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    await getRootDirectoryContents(ignoredDirectories, { withCache: false });

    expect(mockCreateFileSystemNodeMap).toHaveBeenCalledWith(mockPathInfos);
  });

  it('should call createOrganizedFileSystemNodeArray with directory map', async () => {
    const ignoredDirectories = ['node_modules'];
    const mockNodeMap = {
      src: { name: 'src', parentDirectory: null, files: [] },
    };

    mockGlob.mockResolvedValue([]);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue(mockNodeMap);
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    await getRootDirectoryContents(ignoredDirectories, { withCache: false });

    expect(mockCreateOrganizedFileSystemNodeArray).toHaveBeenCalledWith(
      mockNodeMap,
    );
  });

  it('should log time when willLogTime option is true', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const ignoredDirectories = ['node_modules'];

    mockGlob.mockResolvedValue([]);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);
    mockGetTimeDiff.mockReturnValue('25.678');

    await getRootDirectoryContents(ignoredDirectories, {
      withTimeLogging: true,
      withCache: false,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Reading contents of directory and all subdirectories (25.678ms)',
    );

    consoleSpy.mockRestore();
  });

  it('should not log time when willLogTime option is false', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const ignoredDirectories = ['node_modules'];

    mockGlob.mockResolvedValue([]);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    await getRootDirectoryContents(ignoredDirectories, {
      withTimeLogging: false,
      withCache: false,
    });

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should call performance.now and getTimeDiff when starting operation', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const ignoredDirectories = ['node_modules'];
    const startTime = 1234.567;

    const { performance } = jest.requireMock('just-performance');
    (performance.now as jest.Mock).mockReturnValue(startTime);
    mockGlob.mockResolvedValue([]);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    await getRootDirectoryContents(ignoredDirectories, {
      withTimeLogging: true,
      withCache: false,
    });

    expect(performance.now).toHaveBeenCalled();
    expect(mockGetTimeDiff).toHaveBeenCalledWith(startTime);

    consoleSpy.mockRestore();
  });

  it('should handle empty glob results', async () => {
    const ignoredDirectories = ['node_modules'];

    mockGlob.mockResolvedValue([]);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    const result = await getRootDirectoryContents(ignoredDirectories, {
      withCache: false,
    });

    expect(result).toEqual([]);
  });

  it('should handle empty ignored directories', async () => {
    const ignoredDirectories: string[] = [];
    const mockGlobResult = ['src/index.ts'];

    mockGlob.mockResolvedValue(mockGlobResult);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    await getRootDirectoryContents(ignoredDirectories, { withCache: false });

    expect(mockGlob).toHaveBeenCalledWith('**', {
      ignore: [],
      dot: true,
      dotRelative: true,
    });
  });

  it('should enable dot and dotRelative options', async () => {
    const ignoredDirectories = ['node_modules'];

    mockGlob.mockResolvedValue([]);
    mockCreateFileSystemPathInfos.mockReturnValue([]);
    mockCreateFileSystemNodeMap.mockReturnValue({});
    mockCreateOrganizedFileSystemNodeArray.mockReturnValue([]);

    await getRootDirectoryContents(ignoredDirectories, { withCache: false });

    expect(mockGlob).toHaveBeenCalledWith(
      '**',
      expect.objectContaining({ dot: true, dotRelative: true }),
    );
  });
});
