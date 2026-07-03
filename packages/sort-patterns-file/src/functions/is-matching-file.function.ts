import { some } from 'lodash-es';

const { minimatch } = require('minimatch');

export const isMatchingFile = (pattern: string, files: string[]): boolean => some(files, (file) => Boolean(minimatch(file, pattern)));
