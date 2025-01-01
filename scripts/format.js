/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { exec } = require('node:child_process');
const {
  readdir,
  readFile,
  writeFile,
} = require('node:fs/promises');

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

const JS_FILES = ['scripts/*.js', '*.{mjs,cjs}'];

async function readPrettierVersion() {
  const data = await readFile(normalize(`${__filename}/../../package.json`), {
    encoding: 'utf8',
  });

  const json = JSON.parse(data);

  return json && json['devDependencies'] && json['devDependencies']['prettier'];
}

async function getDirectories(source) {
  return (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

async function sortPatterns(path) {
  let data;

  try {
    data = await readFile(normalize(path), {
      encoding: 'utf8',
    });
  } catch {
    data = null;
  }

  if (data === null) {
    return;
  }

  const result = data
    .replaceAll('\r', '\n')
    .split('\n')
    .filter((line) => line)
    .map((line) => ({
      line,
      normalized: normalize(`${__filename}/../../${line}`),
    }));

  result.sort((a, b) => a.normalized.localeCompare(b.normalized));

  return writeFile(
    normalize(path),
    result.map((item) => item.line.trim()).join('\n') + '\n',
  );
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

async function main() {
  const prettierVersion = (await readPrettierVersion()) || 'latest';

  exec(
    `npx prettier@${prettierVersion} --write ${[...JSON_FILES, ...JS_FILES].map((file) => `"${file}"`).join(' ')}`.trimEnd(),
    print,
  );

  sortPatterns(normalize(`${__filename}/../../.gitignore`));

  (await getDirectories(PACKAGES_PATH))
    .map((directory) => normalize(`${PACKAGES_PATH}${directory}`))
    .forEach((directory) => {
      exec(`cd ${directory} && npm run format`, print);

      sortPatterns(normalize(`${directory}/.prettierignore`));
    });
}

main();
