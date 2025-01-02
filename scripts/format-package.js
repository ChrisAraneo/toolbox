/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { readVersion } = require('./utils/read-version');
const { sortPatternsFile } = require('./sort-patterns-file');
const { print } = require('./utils/print');

const PACKAGES_PATH = normalize(`${__filename}/../../packages/`);

const JSON_FILES = ['tsconfig.lib.json', 'tsconfig.json', 'package.json'];

const SOURCE_FILES = ['*.{ts,js,mjs,cjs}', 'src/**/*.ts'];

async function formatPackage(prettierVersion, sortPackageJsonVersion, package) {
  const directory = normalize(`${PACKAGES_PATH}${package}`);

  const patterns =
    `${[...JSON_FILES, ...SOURCE_FILES].map((pattern) => `"${normalize(directory + '/' + pattern)}"`).join(' ')}`.trimEnd();

  const sortPackageJsonCommand = `npx sort-package-json@${sortPackageJsonVersion} "./packages/${package}/package.json"`;
  const prettierCommand = `npx prettier@${prettierVersion} --write ${patterns}`;

  exec(`${sortPackageJsonCommand} && ${prettierCommand}`, print);

  sortPatternsFile(normalize(`${directory}/.prettierignore`));
  sortPatternsFile(normalize(`${directory}/.gitignore`));
}

async function main(packages) {
  if (!packages.length) {
    return;
  }

  const prettierVersion = await readVersion('prettier');
  const sortPackageJsonVersion = await readVersion('sort-package-json');

  packages.forEach((package) =>
    formatPackage(prettierVersion, sortPackageJsonVersion, package),
  );
}

let packages = [];

process.argv.forEach(function (value, index) {
  if (index >= 2) {
    packages.push(value);
  }
});

main(packages);

module.exports = {
  formatPackage: formatPackage,
};
