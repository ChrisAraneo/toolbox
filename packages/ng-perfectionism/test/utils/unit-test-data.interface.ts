import { SourceFile } from "ts-morph";

export interface UnitTestData {
  input: SourceFile;
  output: string;
}
