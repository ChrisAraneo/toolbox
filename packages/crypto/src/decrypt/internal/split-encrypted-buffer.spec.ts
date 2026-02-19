import { splitEncryptedBuffer } from './split-encrypted-buffer';

describe('splitEncryptedBuffer', () => {
  it('should return salt as the first 16 bytes of the buffer', () => {
    const buffer = Buffer.alloc(64, 0);
    buffer.fill(1, 0, 16);

    const result = splitEncryptedBuffer(buffer);

    expect(result.salt).toEqual(Buffer.alloc(16, 1));
  });

  it('should return iv as bytes 16-32 of the buffer', () => {
    const buffer = Buffer.alloc(64, 0);
    buffer.fill(2, 16, 32);

    const result = splitEncryptedBuffer(buffer);

    expect(result.iv).toEqual(Buffer.alloc(16, 2));
  });

  it('should return encrypted as all bytes from position 32 onward', () => {
    const buffer = Buffer.alloc(48, 0);
    buffer.fill(3, 32, 48);

    const result = splitEncryptedBuffer(buffer);

    expect(result.encrypted).toEqual(Buffer.alloc(16, 3));
  });

  it('should correctly split a buffer with distinct regions', () => {
    const salt = Buffer.alloc(16, 11);
    const iv = Buffer.alloc(16, 22);
    const encrypted = Buffer.alloc(32, 33);
    const buffer = Buffer.concat([salt, iv, encrypted]);

    const result = splitEncryptedBuffer(buffer);

    expect(result.salt).toEqual(salt);
    expect(result.iv).toEqual(iv);
    expect(result.encrypted).toEqual(encrypted);
  });

  it('should return an empty buffer for encrypted when the buffer is exactly 32 bytes', () => {
    const buffer = Buffer.alloc(32, 0);

    const result = splitEncryptedBuffer(buffer);

    expect(result.encrypted.length).toBe(0);
  });
});
