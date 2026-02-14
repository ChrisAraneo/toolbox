import { Base64File } from '@chris.araneo/file-system';
import { chain } from 'lodash';
import { decryptBase64File } from './decrypt-base64-file';
import { EncryptedFile } from './classes/encrypted-file.class';

export const decryptBase64Files = (
  files: readonly EncryptedFile[],
  secretKey: string,
): Base64File[] =>
  chain(files)
    .map((file) => decryptBase64File(file, secretKey))
    .value();
