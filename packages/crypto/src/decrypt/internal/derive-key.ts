import { scryptSync } from 'node:crypto';

export const deriveKey =
  (password: string) =>
  (input: { salt: Buffer; iv: Buffer; encrypted: Buffer }) => ({
    iv: input.iv,
    encrypted: input.encrypted,
    key: scryptSync(password, input.salt, 32),
  });
