import * as aes from 'browserify-aes';

export const createAesDecipher = (input: {
  key: Buffer;
  iv: Buffer;
  encrypted: Buffer;
}) => ({
  decipher: aes.createDecipheriv('aes-256-cbc', input.key, input.iv),
  encrypted: input.encrypted,
});
