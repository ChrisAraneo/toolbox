import { createUnitTestData } from "../../utils/create-unit-test-data.function";

const code =  `
@NgModule({
  declarations: [],
  imports: [],
  providers: [],
  exports: []
})
export class FirstModule {}

@NgModule({
  declarations: [],
  imports: [],
  providers: [],
  exports: []
})
export class SecondModule {}
`

export const MULTIPLE_MODULES = createUnitTestData(code, code);
