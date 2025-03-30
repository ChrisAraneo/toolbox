import { createUnitTestData } from '../../utils/create-unit-test-data.function';

export const UNSORTED_MODULE_IMPORTS = createUnitTestData(
  `
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    DirectivesModule,
    MaterialModule,
    AngularFormsModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    LabelModule
  ],
  providers: [],
  exports: []
})
export class FormsModule {}
`,
  `
@NgModule({
  imports: [
    AngularFormsModule,
    BrowserModule,
    CalendarModule,
    DirectivesModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    InputTextModule,
    LabelModule,
    MaterialModule
  ],
  declarations: [],
  providers: [],
  exports: []
})
export class FormsModule {}
`,
);
