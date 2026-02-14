import { Base64File } from '@chris.araneo/file-system';
import { encryptAES } from './internal/encrypt-aes';

export const encryptBase64File = (file: Base64File, secret: string) => ({
  path: file.getPath(),
  content: encryptAES(file.getContent(), secret),
});
