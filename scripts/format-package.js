/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { sortPatternsFile } = require('./sort-patterns-file');
const { print } = require('./print');
const packageJson = require('../package.json');

const PACKAGES_PATH = normalize(`${__filename}/../../packages/`);

const JSON_FILES = ['tsconfig.lib.json', 'tsconfig.json', 'package.json'];

const SOURCE_FILES = ['*.{ts,js,mjs,cjs}', 'src/**/*.ts'];

async function formatPackage(package) {
  const prettierVersion = packageJson.devDependencies.prettier;
  const sortPackageJsonVersion =
    packageJson.devDependencies['sort-package-json'];

  const directory = normalize(`${PACKAGES_PATH}${package}`);

  const patterns =
    `${[...JSON_FILES, ...SOURCE_FILES].map((pattern) => `"${normalize(directory + '/' + pattern)}"`).join(' ')}`.trimEnd();

  const sortPackageJsonCommand = `npx sort-package-json@${sortPackageJsonVersion} "./packages/${package}/package.json"`;
  const prettierCommand = `npx prettier@${prettierVersion} --write ${patterns}`;
  const command = `${sortPackageJsonCommand} && ${prettierCommand}`;

  exec(command, (error, stdout, stderr) => print(error, stdout, stderr));

  sortPatternsFile(normalize(`${directory}/.prettierignore`));
  sortPatternsFile(normalize(`${directory}/.gitignore`));
}

async function main() {
  let packages = [];

  process.argv.forEach(function (value, index) {
    if (index >= 2) {
      packages.push(value);
    }
  });

  if (!packages.length) {
    return;
  }

  packages.forEach((package) => formatPackage(package));
}

main();

module.exports = {
  formatPackage: formatPackage,
};
