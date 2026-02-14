import appRootPath from 'app-root-path';

export const getExtendedCurrentDirectoryInfo = () => ({
  dirname: __dirname,
  filename: __filename,
  root: appRootPath.toString(),
  cwd: process.cwd(),
});
