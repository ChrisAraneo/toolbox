import { Base64File } from '@chris.araneo/file-system';
import { map } from 'lodash';
import { decryptBase64File } from './decrypt-base64-file';
import { EncryptedFile } from '../classes/encrypted-file.class';

export const decryptBase64Files = (
  files: readonly EncryptedFile[],
  secret: string,
): Base64File[] => map(files, (file) => decryptBase64File(file, secret));
