import { Base64File } from '@chris.araneo/file-system';
import { EncryptionResult } from './types/encryption-result.type';
import { encryptAES } from './utils/encrypt-aes';

export const encryptBase64File = (
  file: Base64File,
  secret: string,
): EncryptionResult => ({
  path: file.getPath(),
  content: encryptAES(file.getContent(), secret),
});
