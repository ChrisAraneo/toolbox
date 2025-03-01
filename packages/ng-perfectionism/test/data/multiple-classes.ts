import { buildTestData } from "../utils/build-test-data.function";

const code =  `
@Component({
  imports: [SomeModule],
  selector: 'app-one',
  styleUrl: './one.component.css',
  standalone: true,
  templateUrl: './one.component.html',
})
export class FirstComponent {}

@Component({
  imports: [SomeModule],
  selector: 'app-two',
  styleUrl: './two.component.css',
  standalone: true,
  templateUrl: './two.component.html',
})
export class SecondComponent {}
`

export const MULTIPLE_CLASSES = buildTestData(code, code);
