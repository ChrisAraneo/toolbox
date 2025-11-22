import { isMatchingDirectory } from './is-matching-directory.function';

describe('isMatchingDirectory', () => {
  describe('exact and simple patterns', () => {
    it('should return true when directory matches exact pattern', () => {
      const pattern = 'src';
      const directory = 'src';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return false when directory does not match pattern', () => {
      const pattern = 'src';
      const directory = 'lib';

      expect(isMatchingDirectory(pattern, directory)).toBe(false);
    });

    it('should handle empty directory string', () => {
      const pattern = 'src';
      const directory = '';

      expect(isMatchingDirectory(pattern, directory)).toBe(false);
    });

    it('should return true when both pattern and directory are empty', () => {
      const pattern = '';
      const directory = '';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });
  });

  describe('wildcard patterns', () => {
    it('should return true when directory matches wildcard pattern', () => {
      const pattern = 'src/*';
      const directory = 'src/utils';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return false when directory does not match wildcard pattern', () => {
      const pattern = 'src/*';
      const directory = 'lib/utils';

      expect(isMatchingDirectory(pattern, directory)).toBe(false);
    });

    it('should return true when directory matches double star pattern', () => {
      const pattern = 'src/**';
      const directory = 'src/utils/helpers';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return true when directory matches pattern with any segment wildcard', () => {
      const pattern = '**/utils';
      const directory = 'src/utils';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return true when directory matches deep nested pattern', () => {
      const pattern = '**/utils';
      const directory = 'src/lib/packages/utils';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return false when directory does not match any segment wildcard pattern', () => {
      const pattern = '**/utils';
      const directory = 'src/helpers';

      expect(isMatchingDirectory(pattern, directory)).toBe(false);
    });
  });

  describe('multiple segment patterns', () => {
    it('should return true when directory matches pattern with multiple segments', () => {
      const pattern = 'src/utils/*';
      const directory = 'src/utils/helpers';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return false when directory does not match pattern with multiple segments', () => {
      const pattern = 'src/utils/*';
      const directory = 'src/lib/helpers';

      expect(isMatchingDirectory(pattern, directory)).toBe(false);
    });

    it('should return true when directory matches complex nested pattern', () => {
      const pattern = 'packages/*/src';
      const directory = 'packages/utils/src';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return false when directory does not match complex nested pattern', () => {
      const pattern = 'packages/*/src';
      const directory = 'packages/utils/lib';

      expect(isMatchingDirectory(pattern, directory)).toBe(false);
    });
  });

  describe('special character patterns', () => {
    it('should return true when directory matches pattern with question mark wildcard', () => {
      const pattern = 'src?';
      const directory = 'src1';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return false when directory does not match question mark wildcard pattern', () => {
      const pattern = 'src?';
      const directory = 'src12';

      expect(isMatchingDirectory(pattern, directory)).toBe(false);
    });

    it('should return true when directory matches pattern with character class', () => {
      const pattern = 'src[0-9]';
      const directory = 'src5';

      expect(isMatchingDirectory(pattern, directory)).toBe(true);
    });

    it('should return false when directory does not match character class pattern', () => {
      const pattern = 'src[0-9]';
      const directory = 'srca';

      expect(isMatchingDirectory(pattern, directory)).toBe(false);
    });
  });
});
