import { NgPerfectionism } from '../src/ng-perfectionism';
import { UNSORTED_COMPONENT_IMPORTS } from './data/components/unsorted-imports';
import { UNSORTED_COMPONENT_PROPERTIES } from './data/components/unsorted-properties';
import { CLASS_WITHOUT_DECORATOR } from './data/general/class-without-decorator';
import { EMPTY_SOURCE_FILE } from './data/general/empty-source-file';
import { MULTIPLE_CLASSES_WITHOUT_DECORATOR } from './data/general/multiple-classes-without-decorator';
import { NO_CLASS } from './data/general/no-class';
import { UNSORTED_MODULE_IMPORTS } from './data/modules/unsorted-imports-module';
import { UNSORTED_MODULE_PROPERTIES } from './data/modules/unsorted-properties-module';
import { extendExpectWithToEqualSource } from './utils/extend-expect-with-to-equal-source.function';

extendExpectWithToEqualSource();

describe('NgPerfectionism', () => {
  let ngPerfectionism: NgPerfectionism;

  beforeEach(() => {
    ngPerfectionism = new NgPerfectionism();
  });

  describe('organizeMetadataObject', () => {
    it('should throw error when source file is empty', async () => {
      const { input } = EMPTY_SOURCE_FILE;

      await expect(
        ngPerfectionism.organizeMetadataObject(input),
      ).rejects.toThrow('File is empty');
    });

    it('should throw error when no class is present', async () => {
      const { input } = NO_CLASS;

      await expect(
        ngPerfectionism.organizeMetadataObject(input),
      ).rejects.toThrow('File has no class defined');
    });

    it('should throw error when the only class in file does not have decorator', async () => {
      const { input } = CLASS_WITHOUT_DECORATOR;

      await expect(
        ngPerfectionism.organizeMetadataObject(input),
      ).rejects.toThrow("File has no class with supported decorators");
    });

    it('should throw error when all classes in file does not have decorator', async () => {
      const { input } = MULTIPLE_CLASSES_WITHOUT_DECORATOR;

      await expect(
        ngPerfectionism.organizeMetadataObject(input),
      ).rejects.toThrow("File has no class with supported decorators");
    });

    it('should sort properties of the component metadata object in opinionated way', async () => {
      const { input, output } = UNSORTED_COMPONENT_PROPERTIES;

      await ngPerfectionism.organizeMetadataObject(input);

      expect(input).toEqualSource(output);
    });

    it('should sort imports of the component metadata object', async () => {
      const { input, output } = UNSORTED_COMPONENT_IMPORTS;

      await ngPerfectionism.organizeMetadataObject(input);

      expect(input).toEqualSource(output);
    });

    it('should sort properties of the module metadata object in opinionated way', async () => {
      const { input, output } = UNSORTED_MODULE_PROPERTIES;

      await ngPerfectionism.organizeMetadataObject(input);

      expect(input).toEqualSource(output);
    });

    it('should sort imports of the module metadata object', async () => {
      const { input, output } = UNSORTED_MODULE_IMPORTS;

      await ngPerfectionism.organizeMetadataObject(input);

      expect(input).toEqualSource(output);
    });
  });
});
