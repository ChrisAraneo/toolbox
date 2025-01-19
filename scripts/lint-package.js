/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { print } = require('./print');
const packageJson = require('../package.json');

const PACKAGES_PATH = normalize(`${__filename}/../../packages/`);

const JSON_FILES = ['tsconfig.lib.json', 'tsconfig.json'];

const SOURCE_FILES = ['*.{ts,js,mjs,cjs}', 'src/**/*.ts'];

async function lintPackage(package) {
  const eslintVersion = packageJson.devDependencies.eslint;
  const directory = normalize(`${PACKAGES_PATH}${package}`);

  const patterns =
    `${[...JSON_FILES, ...SOURCE_FILES].map((pattern) => `"${normalize(directory + '/' + pattern)}"`).join(' ')}`.trimEnd();

  const command = `npx eslint@${eslintVersion} ${patterns} --fix`;

  exec(command, (error, stdout, stderr) => print(error, stdout, stderr, true));
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

  packages.forEach((package) => lintPackage(package));
}

main();

module.exports = {
  lintPackage: lintPackage,
};
