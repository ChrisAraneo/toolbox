#!/usr/bin/env node

import { map, noop, reduce } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { readGitignore } from './src/functions/read-gitignore.function';
import { sortPatternsFile } from './src/sort-patterns-file.function';

interface ArgvState {
  mode: 'ignore' | 'write';
  files: string[];
  ignoredDirectories: string[];
}

const INITIAL_ARGV_STATE: ArgvState = {
  mode: 'write',
  files: [],
  ignoredDirectories: [],
};

const toArgvState = (state: ArgvState, value: string): ArgvState =>
  match(value)
    .with(P.union('-i', '--ignore'), () => ({
      ...state,
      mode: 'ignore' as const,
    }))
    .with(P.union('-w', '--write'), () => ({
      ...state,
      mode: 'write' as const,
    }))
    .otherwise(() =>
      match(state.mode)
        .with('ignore', () => ({
          ...state,
          ignoredDirectories: [...state.ignoredDirectories, value.trim()],
        }))
        .otherwise(() => ({ ...state, files: [...state.files, value.trim()] })),
    );

const parseArgv = (argv: string[]): ArgvState =>
  reduce(argv.slice(2), toArgvState, INITIAL_ARGV_STATE);

const processFile = (
  file: string,
  ignoredDirectories: string[],
): Promise<void> =>
  sortPatternsFile(file, ignoredDirectories).then(noop, (error: unknown) =>
    console.error(`Error: could not process file ${file}`, error),
  );

void (async () => {
  const { files, ignoredDirectories } = parseArgv(process.argv);

  const allIgnoredDirectories = [
    ...ignoredDirectories,
    ...(await readGitignore()),
  ];

  await Promise.all(
    map(files, (file: string) => processFile(file, allIgnoredDirectories)),
  );
})();
