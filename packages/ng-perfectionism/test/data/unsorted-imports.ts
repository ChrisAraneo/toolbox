import { buildTestData } from '../utils/build-test-data.function';

export const UNSORTED_IMPORTS = buildTestData(
  `
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgClass],
  templateUrl: './button.component.html',
  styleUrls: []
})
export class ButtonComponent extends ThemedDirective {
  protected clicked = false;
}
`,
  `
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgIf],
  templateUrl: './button.component.html',
  styleUrls: []
})
export class ButtonComponent extends ThemedDirective {
  protected clicked = false;
}
`,
);
