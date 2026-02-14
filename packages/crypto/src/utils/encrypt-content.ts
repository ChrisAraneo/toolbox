import { createAesCipher } from './create-aes-cipher';

export const encryptContent = (input: ReturnType<typeof createAesCipher>) => ({
  salt: input.salt,
  iv: input.iv,
  encrypted: Buffer.concat([
    input.cipher.update(input.content, 'utf-8'),
    input.cipher.final(),
  ]),
});
