import { decryptAES } from './internal/decrypt-aes';

export const decryptBase64File = (
  path: string,
  content: string,
  modifiedDate: Date,
  secret: string,
) => ({ path, content: decryptAES(content, secret), modifiedDate });
