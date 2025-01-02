/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { readFile } = require('node:fs/promises');
const { sortPatternsFile } = require('./sort-patterns-file');

const PACKAGES_PATH = normalize(`${__filename}/../../packages/`);

const JSON_FILES = [
  '.prettierrc',
  'tsconfig.lib.json',
  'tsconfig.json',
  'package.json',
];

const SOURCE_FILES = ['*.{ts,js,mjs,cjs}', 'src/**/*.ts'];

async function readDevDependencyVersion(name) {
  const data = await readFile(normalize(`${__filename}/../../package.json`), {
    encoding: 'utf8',
  });

  const json = JSON.parse(data);

  return json && json['devDependencies'] && json['devDependencies'][name];
}

function print(error, stdout) {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  if (stdout.length && stdout.trim().length) {
    console.log(stdout);
  }
}

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

  const prettierVersion =
    (await readDevDependencyVersion('prettier')) || 'latest';

  const sortPackageJsonVersion =
    (await readDevDependencyVersion('sort-package-json')) || 'latest';

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
