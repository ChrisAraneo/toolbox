// Stryker disable all

import { glob } from 'glob';
import { FindOptions } from './interfaces/find-options.interface';
import { createGlobOptions } from './functions/create-glob-options.function';
import { getRootDir } from './functions/get-root-dir.function';
import { normalizePaths } from './functions/normalize-paths.function';

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
