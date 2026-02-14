export const splitEncryptedBuffer = (data: Buffer | unknown) => {
  const buffer = data as Buffer;

  return {
    salt: buffer.subarray(0, 16),
    iv: buffer.subarray(16, 32),
    encrypted: buffer.subarray(32),
  };
};
