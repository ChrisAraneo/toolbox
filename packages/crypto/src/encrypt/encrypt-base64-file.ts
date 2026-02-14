import { encryptAES } from './internal/encrypt-aes';

export const encryptBase64File = (
  path: string,
  content: string,
  secret: string,
) => ({
  path,
  encryptedContent: encryptAES(content, secret),
});
