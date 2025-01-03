/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { readVersion } = require('./utils/read-version');

const PACKAGES_PATH = normalize(`${__filename}/../../packages/`);

const JSON_FILES = ['tsconfig.lib.json', 'tsconfig.json', 'package.json'];

const SOURCE_FILES = ['*.{ts,js,mjs,cjs}', 'src/**/*.ts'];

async function lintPackage(eslintVersion, package) {
  const directory = normalize(`${PACKAGES_PATH}${package}`);

  const patterns =
    `${[...JSON_FILES, ...SOURCE_FILES].map((pattern) => `"${normalize(directory + '/' + pattern)}"`).join(' ')}`.trimEnd();

  const eslintCommand = `npx eslint@${eslintVersion} ${patterns} --fix`;

  exec(`${eslintCommand}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
    }

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }
  });
}

async function main(packages) {
  if (!packages.length) {
    return;
  }

  const eslintVersion = await readVersion('eslint');

  packages.forEach((package) => lintPackage(eslintVersion, package));
}

let packages = [];

process.argv.forEach(function (value, index) {
  if (index >= 2) {
    packages.push(value);
  }
});

main(packages);

module.exports = {
  lintPackage: lintPackage,
};
