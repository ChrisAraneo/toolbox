import { encryptContent } from './encrypt-content';

export const concatToBase64 = (
  input: ReturnType<typeof encryptContent>,
): string =>
  Buffer.concat([input.salt, input.iv, input.encrypted]).toString('base64');
