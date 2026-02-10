import { configBuilder } from '@chris.araneo/eslint-config';

const SOURCES = ['**/!(*.spec).{ts,js,mjs}'];
const TESTS = ['**/*.spec.{ts,js,mjs}'];
const JSONS = ['**/*.json'];
const IGNORED = [
  'node_modules/',
  'dist/',
  'scripts/',
  'coverage/',
  'package-lock.json',
  'package.json',
  'packages/**/package.json',
  'packages/**/*.mock.class.ts',
  'packages/**/dist/',
  'packages/**/node_modules/',
  'eslint.config.mjs',
];

export default configBuilder()
  .addTypeScriptConfig({
    sources: SOURCES,
    tsconfigRootDir: import.meta.dirname,
  })
  .addTypeScriptTestsConfig({
    sources: TESTS,
    tsconfigRootDir: import.meta.dirname,
  })
  .addJsonConfig({
    jsons: JSONS,
  })
  .addIgnored({
    ignored: IGNORED,
  })
  .build();
