import { resolve, normalize } from 'node:path';

import { glob } from 'glob';

type FindOptions = {
  readonly root?: string;
  readonly cwd?: string;
  readonly ignore?: readonly string[];
  readonly dot?: boolean;
};

type GlobOptions = {
  readonly cwd?: string;
  readonly ignore?: string[];
  readonly dot: boolean;
  readonly absolute: boolean;
};

/**
 * Extracts the root directory from options
 */
const getRootDir = (options?: FindOptions): string | undefined =>
  options?.root ?? options?.cwd;

/**
 * Creates glob options from find options
 */
const createGlobOptions = (options?: FindOptions): GlobOptions => ({
  cwd: getRootDir(options),
  ignore: options?.ignore ? [...options.ignore] : undefined,
  dot: options?.dot ?? false,
  absolute: false,
});

/**
 * Creates a path normalizer function based on whether a root directory is provided
 */
const createPathNormalizer =
  (rootDir?: string) =>
  (path: string): string =>
    rootDir ? normalize(resolve(rootDir, path)) : normalize(path);

/**
 * Normalizes an array of paths
 */
const normalizePaths =
  (rootDir?: string) =>
  (paths: readonly string[]): string[] =>
    paths.map(createPathNormalizer(rootDir));

/**
 * Find all files and directories matching the provided glob pattern recursively.
 *
 * @param pattern - Glob pattern to match files and directories (e.g., '**\/*.ts', 'src/**', '*.json')
 * @param options - Optional configuration object
 * @param options.root - Root directory to search from (defaults to process.cwd())
 * @param options.cwd - Alias for root (for backward compatibility)
 * @param options.ignore - Array of patterns to ignore (e.g., ['node_modules/**', 'dist/**'])
 * @param options.dot - Include dotfiles (defaults to false)
 * @returns Promise that resolves to an array of matching file and directory paths
 *
 * @example
 * ```typescript
 * // Find all TypeScript files
 * const tsFiles = await find('**\/*.ts');
 *
 * // Find all files in a specific directory
 * const files = await find('**\/*', { root: 'C:\\projects\\myapp' });
 *
 * // Find all files, ignoring node_modules
 * const files = await find('**\/*', { ignore: ['node_modules/**'] });
 *
 * // Find all files including dotfiles
 * const allFiles = await find('**', { dot: true });
 * ```
 */
export const find = async (
  pattern: string,
  options?: FindOptions,
): Promise<string[]> => {
  const rootDir = getRootDir(options);
  const globOptions = createGlobOptions(options);
  const normalize = normalizePaths(rootDir);

  return glob(pattern, globOptions).then(normalize);
};
