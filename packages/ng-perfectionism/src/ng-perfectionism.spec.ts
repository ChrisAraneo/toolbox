import {
  ArrayLiteralExpression,
  Project,
  PropertyAssignment,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';

import { NgPerfectionism } from './ng-perfectionism';

describe('NgPerfectionism', () => {
  let project: Project;
  let sourceFile: SourceFile;

  beforeEach(() => {
    project = new Project();

    sourceFile = project.createSourceFile('test.component.ts', '', {
      overwrite: true,
    });

    sourceFile.addClass({
      name: 'TestComponent',
      decorators: [
        {
          name: 'Component',
          arguments: [
            `{
              selector: 'app-test',
              templateUrl: './test.component.html',
              styles: ['./test.component.css'],
              standalone: true,
              imports: [],
            }`,
          ],
        },
      ],
    });
  });

  describe('organizeComponentMetadataObject', () => {
    it('should throw error when no component class is present', () => {
      const emptySourceFile = project.createSourceFile(
        'empty.component.ts',
        '',
        { overwrite: true },
      );

      const ngPerfectionism = new NgPerfectionism();

      expect(() =>
        ngPerfectionism.organizeComponentMetadataObject(emptySourceFile),
      ).toThrow('File has no component class defined');
    });

    it('should throw error when more than one class is defined', () => {
      sourceFile.addClass({
        name: 'AnotherClass',
        decorators: [
          {
            name: 'Component',
            arguments: [
              `{
                selector: 'app-another',
                templateUrl: './another.component.html',
              }`,
            ],
          },
        ],
      });

      const ngPerfectionism = new NgPerfectionism();

      expect(() =>
        ngPerfectionism.organizeComponentMetadataObject(sourceFile),
      ).toThrow('File has more than one class');
    });

    it('should throw error when class does not have Component decorator', () => {
      sourceFile = project.createSourceFile('non-component.class.ts', '', {
        overwrite: true,
      });

      sourceFile.addClass({
        name: 'NonComponentClass',
      });

      const ngPerfectionism = new NgPerfectionism();

      expect(() =>
        ngPerfectionism.organizeComponentMetadataObject(sourceFile),
      ).toThrow("Class doesn't have Component decorator");
    });

    it('should sort properties of the component metadata object', () => {
      sourceFile = project.createSourceFile('test.component.ts', '', {
        overwrite: true,
      });

      sourceFile.addClass({
        name: 'TestComponent',
        decorators: [
          {
            name: 'Component',
            arguments: [
              `{
                templateUrl: './test.component.html',
                selector: 'app-test',
                standalone: true,
                styleUrls: ['./test.component2.css'],
                imports: [],
              }`,
            ],
          },
        ],
      });

      const ngPerfectionism = new NgPerfectionism();

      ngPerfectionism.organizeComponentMetadataObject(sourceFile);

      const componentDecorator = sourceFile
        .getClasses()[0]
        ?.getDecorator('Component');
      const metadata = componentDecorator?.getArguments()[0];
      const objectLiteral = metadata?.asKindOrThrow(
        SyntaxKind.ObjectLiteralExpression,
      );

      const propertyNames = objectLiteral
        ?.getProperties()
        .map((property) => (property as PropertyAssignment).getName());

      expect(propertyNames).toEqual([
        'selector',
        'standalone',
        'imports',
        'templateUrl',
        'styleUrls',
      ]);
    });

    it('should sort imports of the component metadata object', () => {
      sourceFile = project.createSourceFile('test.component.ts', '', {
        overwrite: true,
      });

      sourceFile.addClass({
        name: 'TestComponent',
        decorators: [
          {
            name: 'Component',
            arguments: [
              `{
                selector: 'app-test',
                templateUrl: './test.component.html',
                styles: ['./test.component.css'],
                standalone: true,
                imports: [SomeModule, AnotherModule, ThirdModule],
              }`,
            ],
          },
        ],
      });

      const ngPerfectionism = new NgPerfectionism();

      ngPerfectionism.organizeComponentMetadataObject(sourceFile);

      const componentDecorator = sourceFile
        .getClasses()[0]
        ?.getDecorator('Component');
      const metadata = componentDecorator?.getArguments()[0];
      const objectLiteral = metadata?.asKindOrThrow(
        SyntaxKind.ObjectLiteralExpression,
      );

      const importsProperty = objectLiteral?.getProperty(
        'imports',
      ) as PropertyAssignment;
      const importsArray = (
        importsProperty.getInitializer() as ArrayLiteralExpression
      )
        .getElements()
        .map((element) => element.getText());

      expect(importsArray).toEqual([
        'AnotherModule',
        'SomeModule',
        'ThirdModule',
      ]);
    });
  });
});
