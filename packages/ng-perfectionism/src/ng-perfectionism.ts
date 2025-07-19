import { CurrentDirectory, FileFinder } from '@chris.araneo/file-system';
import { FindFileResult } from '@chris.araneo/file-system/src/file-finder/find-file-result.type';
import * as Prettier from 'prettier';
import { catchError, finalize, first, of } from 'rxjs';
import {
  ArrayLiteralExpression,
  ClassDeclaration,
  Decorator,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';

const TEMPORARY_PREFIX = 'ΩΩΩ';

const DECORATOR_NAMES = ['Component', 'NgModule'];

const COMPONENT_PROPERTIES_ORDER = [
  'selector',
  'standalone',
  'imports',
  'template',
  'templateUrl',
  'styles',
  'styleUrl',
  'styleUrls',
];

const MODULE_PROPERTIES_ORDER = [
  'imports',
  'declarations',
  'providers',
  'exports',
];

export class NgPerfectionism {
  async findFiles(
    pattern: string | RegExp,
    workingDirectory?: string,
  ): Promise<FindFileResult> {
    const fileFinder = new FileFinder();
    const directory =
      workingDirectory || new CurrentDirectory().getCurrentDirectory();
    let result: FindFileResult;

    return new Promise((resolve, reject) => {
      fileFinder
        .findFile(pattern, directory)
        .pipe(
          first(),
          catchError((error: unknown) => {
            reject(error);

            return of(null);
          }),
          finalize(() => {
            resolve(result);
          }),
        )
        .subscribe((data) => {
          if (data) {
            result = data;
          }
        });
    });
  }

  async resolvePrettierConfig(workingDirectory?: string) {
    return Prettier.resolveConfig(
      workingDirectory || new CurrentDirectory().getCurrentDirectory(),
    );
  }

  async organizeMetadataObject(
    sourceFile: SourceFile,
    prettierOptions: Prettier.Options | null = null,
  ): Promise<SourceFile> {
    const classDeclarations = this.getClassesOrThrow(sourceFile);

    const decorators = this.getDecoratorsOrThrow(classDeclarations);

    await Promise.all(
      decorators.map(async (decorator) => {
        const metadata = decorator.getArguments()[0];

        if (!metadata) {
          return;
        }

        const metadataObject = metadata.asKindOrThrow(
          SyntaxKind.ObjectLiteralExpression,
        );

        const properties = metadataObject.getProperties();

        this.sortProperties(properties, decorator.getName());
        this.addTemporaryPropertiesWithOrganizedValues(
          properties,
          metadataObject,
        );
        this.removeSourceProperties(metadataObject);
        this.renameTemporaryProperties(metadataObject);
      }),
    );

    return new Project().createSourceFile(
      sourceFile.getFilePath(),
      await this.format(sourceFile, prettierOptions),
    );
  }

  async format(
    sourceFile: SourceFile,
    options?: Prettier.Options | null,
  ): Promise<string> {
    let error: unknown;
    let result = '';

    try {
      result = await Prettier.format(
        sourceFile.getFullText(),
        options || undefined,
      );
    } catch (error_: unknown) {
      error = error_;
    }

    if (error) {
      const sourceFileCopy = new Project().createSourceFile(
        sourceFile.getFilePath(),
        sourceFile.getFullText(),
      );

      sourceFileCopy.formatText();

      result = sourceFileCopy.getFullText();
    }

    return result;
  }

  private getClassesOrThrow(sourceFile: SourceFile): ClassDeclaration[] {
    const classes = sourceFile.getClasses();

    if (classes.length === 0) {
      if (sourceFile.getFullText().trim().length === 0) {
        throw new Error('File is empty');
      }

      throw new Error('File has no class defined');
    }

    return classes;
  }

  private getDecoratorsOrThrow(
    classDeclarations: ClassDeclaration[],
  ): Decorator[] {
    const decorators: Decorator[] = [];

    for (const classDeclaration of classDeclarations) {
      for (const name of DECORATOR_NAMES) {
        const decorator = classDeclaration.getDecorator(name);

        if (decorator) {
          decorators.push(decorator);
        }
      }
    }

    if (decorators.length === 0) {
      throw new Error('File has no class with supported decorators');
    }

    return decorators;
  }

  private sortProperties(
    properties: ObjectLiteralElementLike[],
    decoratorName: string,
  ): void {
    let order: string[] = [];

    if (decoratorName === 'Component') {
      order = COMPONENT_PROPERTIES_ORDER;
    } else if (decoratorName === 'NgModule') {
      order = MODULE_PROPERTIES_ORDER;
    }

    properties.sort((a, b) => {
      if (a instanceof PropertyAssignment && b instanceof PropertyAssignment) {
        const aKey = a.getName();
        const bKey = b.getName();

        const aOrder = order.indexOf(aKey);
        const bOrder = order.indexOf(bKey);

        if (aOrder !== -1 && bOrder !== -1) {
          return aOrder - bOrder;
        }

        if (aOrder !== -1) {
          return -1;
        }

        if (bOrder !== -1) {
          return 1;
        }

        return aKey.localeCompare(bKey);
      }
      throw new Error('Unsupported yet');
    });
  }

  private addTemporaryPropertiesWithOrganizedValues(
    properties: ObjectLiteralElementLike[],
    objectLiteral: ObjectLiteralExpression,
  ): void {
    for (const property of properties) {
      if (property instanceof PropertyAssignment) {
        const initializer = property.getInitializer();

        if (initializer && initializer instanceof ArrayLiteralExpression) {
          const textElements = initializer
            .getElements()
            .map((element) => element.getText());

          textElements.sort((a, b) => a.localeCompare(b));

          initializer.replaceWithText('[]');

          for (const text of textElements) {
            initializer.addElement(text);
          }

          objectLiteral.addPropertyAssignment({
            name: `${TEMPORARY_PREFIX}${property.getName()}`,
            initializer: initializer.getText() || 'undefined',
          });
        } else {
          objectLiteral.addPropertyAssignment({
            name: `${TEMPORARY_PREFIX}${property.getName()}`,
            initializer: property.getInitializer()?.getText() || 'undefined',
          });
        }
      } else {
        throw new TypeError('Unsupported');
      }
    }
  }

  private removeSourceProperties(objectLiteral: ObjectLiteralExpression): void {
    for (const property of objectLiteral.getProperties()) {
      if (property instanceof PropertyAssignment) {
        if (!property.getName().includes(TEMPORARY_PREFIX)) {
          property.remove();
        }
      } else {
        throw new TypeError('Unsupported');
      }
    }
  }

  private renameTemporaryProperties(
    objectLiteral: ObjectLiteralExpression,
  ): void {
    for (const property of objectLiteral.getProperties()) {
      if (
        property instanceof PropertyAssignment &&
        property.getName().startsWith(TEMPORARY_PREFIX)
      ) {
        property.rename(property.getName().replace(TEMPORARY_PREFIX, ''));
      }
    }
  }
}
