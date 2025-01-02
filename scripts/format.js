/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { readdir } = require('node:fs/promises');
const { sortPatternsFile } = require('./sort-patterns-file');
const { formatPackage } = require('./format-package');
const { readVersion } = require('./utils/read-version');
const { print } = require('./utils/print');

const PACKAGES_PATH = normalize(`${__filename}/../../packages/`);

const JSON_FILES = [
  '.vscode/*.json',
  '.prettierrc',
  'nx.json',
  'stryker.config.json',
  'tsconfig.base.json',
  'tsconfig.json',
  'package.json',
];

const SOURCE_FILES = ['scripts/**/*.js', '*.{ts,js,mjs,cjs}'];

async function getDirectories(source) {
  return (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

async function formatAll(prettierVersion, sortPackageJsonVersion) {
  const prettierCommand = `npx prettier@${prettierVersion} --write ${[...JSON_FILES, ...SOURCE_FILES].map((pattern) => `"${pattern}"`).join(' ')}`;
  const sortPackageJsonCommand = `npx sort-package-json@${sortPackageJsonVersion} "package.json"`;

  exec(`${sortPackageJsonCommand} && ${prettierCommand}`, print);

  sortPatternsFile(normalize(`${__filename}/../../.gitignore`));

  (await getDirectories(PACKAGES_PATH)).map((directory) =>
    formatPackage(prettierVersion, sortPackageJsonVersion, directory),
  );
}

async function main() {
  let packages = [];

  process.argv.forEach(function (value, index) {
    if (index >= 2 && value) {
      packages.push(value);
    }
  });

  const prettierVersion = await readVersion('prettier');
  const sortPackageJsonVersion = await readVersion('sort-package-json');

  if (!packages.length) {
    formatAll(prettierVersion, sortPackageJsonVersion);
  } else {
    packages.forEach((package) =>
      formatPackage(prettierVersion, sortPackageJsonVersion, package),
    );
  }
}

main();
