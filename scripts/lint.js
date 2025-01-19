/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { readdir } = require('node:fs/promises');
const { lintPackage } = require('./lint-package');
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
];

const SOURCE_FILES = ['scripts/**/*.js', '*.{ts,js,mjs,cjs}'];

async function getDirectories(source) {
  return (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

async function lintAll() {
  const eslintVersion = packageJson.devDependencies.eslint;

  const patterns = `${[...JSON_FILES, ...SOURCE_FILES].map((pattern) => `"${pattern}"`).join(' ')}`;
  const command = `npx eslint@${eslintVersion} ${patterns} --fix`;

  exec(command, (error, stdout, stderr) => print(error, stdout, stderr, true));

  (await getDirectories(PACKAGES_PATH)).map((directory) =>
    lintPackage(directory),
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
    lintAll();
  } else {
    packages.forEach((package) => lintPackage(package));
  }
}

main();
