import { CurrentDirectory, FileFinder } from '@chris.araneo/file-system';
import { FindFileResult } from '@chris.araneo/file-system/src/file-finder/find-file-result.type';
import { catchError, finalize, first, of } from 'rxjs';
import {
  ArrayLiteralExpression,
  ClassDeclaration,
  Decorator,
  ObjectLiteralElementLike,
  ObjectLiteralExpression,
  PropertyAssignment,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';

const TEMPORARY_PREFIX = 'ΩΩΩ';

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
  findFiles(workingDirectory?: string): Promise<FindFileResult> {
    const fileFinder = new FileFinder();
    const directory =
      workingDirectory || new CurrentDirectory().getCurrentDirectory();
    let result: FindFileResult;

    return new Promise((resolve, reject) => {
      fileFinder
        .findFile(/\.component\.ts$/, directory)
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

  organizeComponentMetadataObject(sourceFile: SourceFile): void {
    const classDeclaration = this.getSingleClassOrThrow(sourceFile);
    const moduleDecorator = this.getDecoratorOrThrow(
      classDeclaration,
      'Component',
    );
    const metadata = moduleDecorator.getArguments()[0];

    if (!metadata) {
      return sourceFile.formatText();
    }

    const metadataObject = metadata.asKindOrThrow(
      SyntaxKind.ObjectLiteralExpression,
    );

    const properties = metadataObject.getProperties();

    this.sortProperties(properties, COMPONENT_PROPERTIES_ORDER);
    this.addTemporaryPropertiesWithOrganizedValues(properties, metadataObject);
    this.removeSourceProperties(metadataObject);
    this.renameTemporaryProperties(metadataObject);

    sourceFile.formatText();
  }

  organizeModuleMetadataObject(sourceFile: SourceFile): void {
    const classDeclaration = this.getSingleClassOrThrow(sourceFile);
    const moduleDecorator = this.getDecoratorOrThrow(
      classDeclaration,
      'NgModule',
    );
    const metadata = moduleDecorator.getArguments()[0];

    if (!metadata) {
      return sourceFile.formatText();
    }

    const metadataObject = metadata.asKindOrThrow(
      SyntaxKind.ObjectLiteralExpression,
    );

    const properties = metadataObject.getProperties();

    this.sortProperties(properties, MODULE_PROPERTIES_ORDER);
    this.addTemporaryPropertiesWithOrganizedValues(properties, metadataObject);
    this.removeSourceProperties(metadataObject);
    this.renameTemporaryProperties(metadataObject);

    sourceFile.formatText();
  }

  private getSingleClassOrThrow(sourceFile: SourceFile): ClassDeclaration {
    const classes = sourceFile.getClasses();

    if (classes.length === 0) {
      if (sourceFile.getFullText().trim().length === 0) {
        throw new Error('File is empty');
      }

      throw new Error('File has no class defined');
    }

    if (classes.length > 1) {
      throw new Error('File has more than one class');
    }

    return classes[0];
  }

  private getDecoratorOrThrow(
    classDeclaration: ClassDeclaration,
    name: 'Component' | 'NgModule',
  ): Decorator {
    const decorator = classDeclaration?.getDecorator(name);

    if (!decorator) {
      throw new Error(`Class doesn't have ${name} decorator`);
    }

    return decorator;
  }

  private sortProperties(
    properties: ObjectLiteralElementLike[],
    order: string[],
  ): void {
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
      } else {
        throw new Error('Unsupported yet');
      }
    });
  }

  private addTemporaryPropertiesWithOrganizedValues(
    properties: ObjectLiteralElementLike[],
    objectLiteral: ObjectLiteralExpression,
  ): void {
    properties.forEach((property) => {
      if (property instanceof PropertyAssignment) {
        const initializer = property.getInitializer();

        if (initializer && initializer instanceof ArrayLiteralExpression) {
          const textElements = initializer
            .getElements()
            .map((element) => element.getText());

          textElements.sort((a, b) => {
            return a.localeCompare(b);
          });

          initializer.replaceWithText('[]');

          textElements.forEach((text) => {
            initializer.addElement(text);
          });

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
        throw new Error('Unsupported');
      }
    });
  }

  private removeSourceProperties(objectLiteral: ObjectLiteralExpression): void {
    objectLiteral.getProperties().forEach((property) => {
      if (property instanceof PropertyAssignment) {
        if (property.getName().indexOf(TEMPORARY_PREFIX) === -1) {
          property.remove();
        }
      } else {
        throw new Error('Unsupported');
      }
    });
  }

  private renameTemporaryProperties(
    objectLiteral: ObjectLiteralExpression,
  ): void {
    objectLiteral.getProperties().forEach((property) => {
      if (
        property instanceof PropertyAssignment &&
        property.getName().indexOf(TEMPORARY_PREFIX) == 0
      ) {
        property.rename(property.getName().replace(TEMPORARY_PREFIX, ''));
      }
    });
  }
}
