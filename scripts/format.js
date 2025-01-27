/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { readdir } = require('node:fs/promises');
const { sortPatternsFile } = require('./sort-patterns-file');
const { formatPackage } = require('./format-package');
const { print } = require('./print');
const packageJson = require('../package.json');

const PACKAGES_PATH = normalize(`${__filename}/../../packages/`);

const JSON_FILES = [
  '.vscode/*.json',
  '.prettierrc.json',
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

async function formatAll() {
  const prettierVersion = packageJson.devDependencies.prettier;
  const sortPackageJsonVersion =
    packageJson.devDependencies['sort-package-json'];

  const prettierCommand = `npx prettier@${prettierVersion} --write ${[...JSON_FILES, ...SOURCE_FILES].map((pattern) => `"${pattern}"`).join(' ')}`;
  const sortPackageJsonCommand = `npx sort-package-json@${sortPackageJsonVersion} "package.json"`;
  const command = `${sortPackageJsonCommand} && ${prettierCommand}`;

  exec(command, (error, stdout, stderr) => print(error, stdout, stderr));

  sortPatternsFile(normalize(`${__filename}/../../.gitignore`));

  (await getDirectories(PACKAGES_PATH)).map((directory) =>
    formatPackage(directory),
  );
}

async function main() {
  let packages = [];

  process.argv.forEach(function (value, index) {
    if (index >= 2 && value) {
      packages.push(value);
    }
  });

  if (!packages.length) {
    formatAll();
  } else {
    packages.forEach((package) => formatPackage(package));
  }
}

main();
