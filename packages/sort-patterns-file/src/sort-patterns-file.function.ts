/* eslint-disable @typescript-eslint/no-require-imports */

const { normalize } = require('node:path');
const { readFile, writeFile } = require('node:fs/promises');
const process = require('node:process');
const { normalizeGlob } = require('normalize-glob');

export async function sortPatternsFile() {
  process.argv.forEach(async (value: string, index: number) => {
    if (index <= 1) {
      return;
    }

    let data;

    try {
      data = await readFile(normalize(value), {
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
      .filter((line: string) => line)
      .map((line: string) => ({
        line,
        normalized: Array.from(normalizeGlob(line, process.cwd()))[0],
      }));

    result.sort((a: { normalized: string }, b: { normalized: string }) =>
      a.normalized.localeCompare(b.normalized),
    );

    writeFile(
      normalize(value),
      result.map((item: { line: string }) => item.line.trim()).join('\n') +
        '\n',
    );
  });
}
