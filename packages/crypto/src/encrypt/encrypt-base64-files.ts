import { Base64File } from '@chris.araneo/file-system';
import { map } from 'lodash';
import { encryptBase64File } from './encrypt-base64-file';

export const encryptBase64Files = (
  files: readonly Base64File[],
  secret: string,
) => map(files, (file) => encryptBase64File(file, secret));
