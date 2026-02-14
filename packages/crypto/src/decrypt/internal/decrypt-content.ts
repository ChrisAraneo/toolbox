import { createAesDecipher } from './create-aes-decipher';

export const decryptContent = (
  input: ReturnType<typeof createAesDecipher>,
): Buffer =>
  Buffer.concat([
    input.decipher.update(input.encrypted),
    input.decipher.final(),
  ]);
