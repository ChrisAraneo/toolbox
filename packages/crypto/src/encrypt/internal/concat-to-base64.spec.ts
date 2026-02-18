import { concatToBase64 } from './concat-to-base64';

describe('concatToBase64', () => {
  it('should concatenate salt, iv, and encrypted buffers and return a base64 string', () => {
    const salt = Buffer.from([1, 2, 3, 4]);
    const iv = Buffer.from([5, 6, 7, 8]);
    const encrypted = Buffer.from([9, 10, 11, 12]);

    const result = concatToBase64({ salt, iv, encrypted });

    const expected = Buffer.concat([salt, iv, encrypted]).toString('base64');
    expect(result).toBe(expected);
  });

  it('should return a string', () => {
    const salt = Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 1);
    const encrypted = Buffer.alloc(16, 2);

    const result = concatToBase64({ salt, iv, encrypted });

    expect(typeof result).toBe('string');
  });

  it('should produce different output when buffers differ', () => {
    const input1 = {
      salt: Buffer.from([1]),
      iv: Buffer.from([2]),
      encrypted: Buffer.from([3]),
    };
    const input2 = {
      salt: Buffer.from([4]),
      iv: Buffer.from([5]),
      encrypted: Buffer.from([6]),
    };

    expect(concatToBase64(input1)).not.toBe(concatToBase64(input2));
  });
});
