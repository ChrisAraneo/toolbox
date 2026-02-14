import * as aes from 'browserify-aes';

export const createAesCipher = (input: {
  key: Buffer;
  iv: Buffer;
  salt: Buffer;
  content: string;
  password: string;
}) => ({
  iv: input.iv,
  salt: input.salt,
  content: input.content,
  password: input.password,
  cipher: aes.createCipheriv('aes-256-cbc', input.key, input.iv),
});
