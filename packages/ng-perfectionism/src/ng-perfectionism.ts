import {
  ArrayLiteralExpression,
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

export class NgPerfectionism {
  sortComponentMetadataObjectProperties(sourceFile: SourceFile): SourceFile {
    const classes = sourceFile.getClasses();

    if (classes.length === 0) {
      throw new Error('File has no component class defined');
    }

    if (classes.length > 1) {
      throw new Error('File has more than one class');
    }

    const componentDecorator = sourceFile
      .getClasses()[0]
      ?.getDecorator('Component');

    if (!componentDecorator) {
      throw new Error("Class doesn't have Component decorator");
    }

    const metadata = componentDecorator.getArguments()[0];

    if (!metadata) {
      return sourceFile;
    }

    const metadataObject = metadata.asKindOrThrow(
      SyntaxKind.ObjectLiteralExpression,
    );

    const properties = metadataObject.getProperties();

    this.sortProperties(properties);
    this.addTemporaryPropertiesWithSortedValues(properties, metadataObject);
    this.removeSourceProperties(metadataObject);
    this.renameTemporaryProperties(metadataObject);

    sourceFile.formatText();

    return sourceFile;
  }

  private sortProperties(properties: ObjectLiteralElementLike[]): void {
    properties.sort((a, b) => {
      if (a instanceof PropertyAssignment && b instanceof PropertyAssignment) {
        const aKey = a.getName();
        const bKey = b.getName();

        const aOrder = COMPONENT_PROPERTIES_ORDER.indexOf(aKey);
        const bOrder = COMPONENT_PROPERTIES_ORDER.indexOf(bKey);

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

  private addTemporaryPropertiesWithSortedValues(
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
