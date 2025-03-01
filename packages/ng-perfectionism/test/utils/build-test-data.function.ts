import { Project } from 'ts-morph';

import { UnitTestData } from './unit-test-data.interface';

export function buildTestData(input: string, output: string): UnitTestData {
  const filename = 'test.component.ts';
  const options = { overwrite: true };

  const inputSourceFile = new Project().createSourceFile(
    filename,
    input,
    options,
  );
  const outputSourceFile = new Project().createSourceFile(
    filename,
    output,
    options,
  );

  outputSourceFile.formatText();

  return {
    input: inputSourceFile,
    output: outputSourceFile.getFullText(),
  };
}
