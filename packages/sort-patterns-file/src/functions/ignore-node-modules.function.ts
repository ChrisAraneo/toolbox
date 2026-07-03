import { filter } from 'lodash-es';

export const ignoreNodeModules = (patterns: string[]): string[] => filter(patterns, (pattern) => pattern !== 'node_modules');
