import { NgPerfectionism } from '../src/ng-perfectionism';
import { EMPTY_SOURCE_FILE } from './data/empty-source-file';
import { MULTIPLE_CLASSES } from './data/multiple-classes';
import { NO_CLASS } from './data/no-class';
import { NO_COMPONENT_DECORATOR } from './data/no-component-decorator';
import { UNSORTED_IMPORTS } from './data/unsorted-imports';
import { UNSORTED_PROPERTIES } from './data/unsorted-properties';

describe('NgPerfectionism', () => {
  let ngPerfectionism: NgPerfectionism;

  beforeAll(() => {
    ngPerfectionism = new NgPerfectionism();
  });

  describe('organizeComponentMetadataObject', () => {
    it('should throw error when source file is empty', () => {
      const { input } = EMPTY_SOURCE_FILE;

      expect(() =>
        ngPerfectionism.organizeComponentMetadataObject(input),
      ).toThrow('File has no component class defined');
    });

    it('should throw error when no component class is present', () => {
      const { input } = NO_CLASS;

      expect(() =>
        ngPerfectionism.organizeComponentMetadataObject(input),
      ).toThrow('File has no component class defined');
    });

    it('should throw error when more than one class is defined', () => {
      const { input } = MULTIPLE_CLASSES;

      expect(() =>
        ngPerfectionism.organizeComponentMetadataObject(input),
      ).toThrow('File has more than one class');
    });

    it('should throw error when class does not have Component decorator', () => {
      const { input } = NO_COMPONENT_DECORATOR;

      expect(() =>
        ngPerfectionism.organizeComponentMetadataObject(input),
      ).toThrow("Class doesn't have Component decorator");
    });

    it('should sort properties of the metadata object in opinionated way', () => {
      const { input, output } = UNSORTED_PROPERTIES;

      ngPerfectionism.organizeComponentMetadataObject(input);

      expect(input.getFullText()).toEqual(output);
    });

    it('should sort imports of the component metadata object', () => {
      const { input, output } = UNSORTED_IMPORTS;

      ngPerfectionism.organizeComponentMetadataObject(input);

      expect(input.getFullText()).toEqual(output);
    });
  });
});
