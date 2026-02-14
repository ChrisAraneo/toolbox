export const splitEncryptedBuffer = (buffer: Buffer | unknown) => ({
  salt: (buffer as Buffer).subarray(0, 16),
  iv: (buffer as Buffer).subarray(16, 32),
  encrypted: (buffer as Buffer).subarray(32),
});
