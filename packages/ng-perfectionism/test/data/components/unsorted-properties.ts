import { buildTestData } from '../../utils/build-test-data.function';

export const UNSORTED_PROPERTIES = buildTestData(
  `
@Component({
  imports: [SomeModule],
  selector: 'app-test',
  styleUrl: './test.component.css',
  standalone: true,
  templateUrl: './test.component.html',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [],
  animations: [],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespace: true,
  schemas: []
})
export class TestComponent {}
`,
  `
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [SomeModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  animations: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespace: true,
  providers: [],
  schemas: [],
  viewProviders: []
})
export class TestComponent {}
`,
);
