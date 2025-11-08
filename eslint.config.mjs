import createConfigs from '@chris.araneo/eslint-config';

export default [
  ...createConfigs({
    jsons: ['**/*.json'],
    sources: ['**/!(*.spec).{ts,js,mjs}'],
    tests: ['**/*.spec.ts'],
    ignored: [
      'node_modules/',
      'dist/',
      'scripts/',
      'coverage/',
      'package-lock.json',
      'package.json',
      'packages/**/package.json',
      'packages/**/dist/',
      'packages/**/node_modules/',
      'eslint.config.mjs',
    ],
    tsconfigRootDir: import.meta.dirname,
  }),
];
