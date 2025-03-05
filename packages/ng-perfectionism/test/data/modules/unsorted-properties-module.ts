import { createUnitTestData } from '../../utils/create-unit-test-data.function';

export const UNSORTED_MODULE_PROPERTIES = createUnitTestData(
  `
@NgModule({
  providers: [],
  exports: [],
  declarations: [],
  imports: []
})
export class FormsModule {}
`,
  `
@NgModule({
  imports: [],
  declarations: [],
  providers: [],
  exports: []
})
export class FormsModule {}
`,
);
