/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const { readdir } = require('node:fs/promises');

async function getDirectories(source) {
  return (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

async function main() {
  const packagesPath = normalize(`${__filename}/../../packages/`);

  (await getDirectories(packagesPath)).forEach((directory) => {
    exec(
      `cd ${normalize(`${packagesPath}${directory}`)} && npm run format`,
      (error, stdout) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }

        console.log(stdout);
      },
    );
  });
}

main();
