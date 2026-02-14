import { Base64File } from '@chris.araneo/file-system';
import { EncryptedFile } from '../classes/encrypted-file.class';
import { decryptAES } from './internal/decrypt-aes';

export const decryptBase64File = (
  file: EncryptedFile,
  secretKey: string,
): Base64File =>
  new Base64File(
    file.getPath(),
    decryptAES(file.getContent(), secretKey),
    file.getModifiedDate(),
  );
