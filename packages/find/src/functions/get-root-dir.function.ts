import { FindOptions } from '../interfaces/find-options.interface';

/**
 * Extracts the root directory from options
 */
export const getRootDir = (options?: FindOptions): string | undefined =>
  options?.root ?? options?.cwd;
