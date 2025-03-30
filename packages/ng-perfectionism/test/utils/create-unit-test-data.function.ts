import { Project, SourceFileCreateOptions } from 'ts-morph';

import { UnitTestData } from './unit-test-data.interface';

export function createUnitTestData(input: string, output: string): UnitTestData {
  const filename = 'test.component.ts';
  const options = { overwrite: true };

  return {
    input: createSourceFile(filename, input, options),
    output: createSourceFile(filename, output, options),
  };
}

function createSourceFile(filename: string, code: string, options?: SourceFileCreateOptions) {
  return new Project().createSourceFile(
    filename,
    code,
    options,
  );
}