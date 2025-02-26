import { Project, PropertyAssignment, SyntaxKind } from 'ts-morph';

export class NgPerfectionism {
  sortComponentMetadataObjectProperties(path: string): void {
    const project = new Project();

    const sourceFile = project.addSourceFileAtPath(path);

    const componentDecorator = sourceFile
      .getClasses()[0]
      ?.getDecorator('Component');

    if (componentDecorator) {
      const metadata = componentDecorator.getArguments()[0];

      if (metadata) {
        const metadataObject = metadata.asKindOrThrow(
          SyntaxKind.ObjectLiteralExpression,
        );

        const properties = metadataObject.getProperties();

        properties.sort((a, b) => {
          if (
            a instanceof PropertyAssignment &&
            b instanceof PropertyAssignment
          ) {
            return a.getName().localeCompare(b.getName());
          } else {
            throw new Error('Not supported yet');
          }
        });

        const temporaryPrefix = '_____';

        properties.forEach((property) => {
          if (property instanceof PropertyAssignment) {
            metadataObject.addPropertyAssignment({
              name: `${temporaryPrefix}${property.getName()}`,
              initializer: property.getInitializer()?.getText() || 'ERROR',
            });
          }
        });

        metadataObject.getProperties().forEach((property) => {
          if (
            property instanceof PropertyAssignment &&
            property.getName().indexOf(temporaryPrefix) < 0
          ) {
            property.remove();
          }
        });

        metadataObject.getProperties().forEach((property) => {
          if (
            property instanceof PropertyAssignment &&
            property.getName().indexOf(temporaryPrefix) == 0
          ) {
            property.rename(property.getName().replace(temporaryPrefix, ''));
          }
        });
      }
    } else {
      // TODO
    }

    sourceFile.saveSync();

    console.log('Component metadata sorted alphabetically');
  }
}
