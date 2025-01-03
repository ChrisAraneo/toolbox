/* eslint-disable no-undef */

function print(error, stdout) {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  if (stdout.length && stdout.trim().length) {
    console.log(stdout);
  }
}

module.exports = {
  print: print,
};
