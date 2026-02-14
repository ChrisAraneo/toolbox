export const bufferToUtf8 = (decrypted: unknown): string =>
  (decrypted as Buffer).toString('utf-8');
