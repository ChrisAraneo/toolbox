/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Node,SourceFile } from 'ts-morph';

export function extendExpectWithToEqualSource(): void {
  expect.extend({
    toEqualSource(received: SourceFile, expected: SourceFile) {
      if (areSourcesEqual(received, expected)) {
        return {
          message: () =>
            `Expected: ${this.utils.printExpected(received.getFullText())}\nReceived: ${this.utils.printReceived(received.getFullText())}`,
          pass: true,
        };
      }
      return {
        message: () =>
          `Expected: ${this.utils.printExpected(expected.getFullText())}\nReceived: ${this.utils.printReceived(
            received.getFullText(),
          )}\n\n${this.utils.diff(expected.getFullText(), received.getFullText())}`,
        pass: false,
      };
    },
  });
}

/**
 * https://github.com/dsherret/ts-morph/issues/499
 * @author David Sherret <https://github.com/dsherret>
 */
function areSourcesEqual(
  sourceFile1: SourceFile,
  sourceFile2: SourceFile,
): boolean {
  const leafNodes1 = getLeafNodes(sourceFile1);
  const leafNodes2 = getLeafNodes(sourceFile2);

  while (true) {
    const leaf1 = leafNodes1.next();
    const leaf2 = leafNodes2.next();

    if (leaf1.done && leaf2.done) {return true;}
    if (leaf1.done || leaf2.done) {return false;}
    if (leaf1.value.getText() !== leaf2.value.getText()) {return false;}
  }

  function* getLeafNodes(sourceFile: SourceFile): Generator<any, void> {
    yield* searchNode(sourceFile);

    function* searchNode(node: Node): any {
      const children = node.getChildren();
      if (children.length === 0) {yield node;}
      else {
        for (const child of children) {yield* searchNode(child);}
      }
    }
  }
}

interface CustomMatchers<R = unknown> {
  toEqualSource: (todo?: Partial<SourceFile>  ) => R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}
