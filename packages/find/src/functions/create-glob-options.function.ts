import { FindOptions } from '../interfaces/find-options.interface';
import { GlobOptions } from '../interfaces/glob-options.interface';
import { getRootDir } from './get-root-dir.function';

/**
 * Creates glob options from find options
 */
export const createGlobOptions = (options?: FindOptions): GlobOptions => ({
  cwd: getRootDir(options),
  ignore: options?.ignore ? [...options.ignore] : undefined,
  dot: options?.dot ?? false,
  absolute: false,
});
