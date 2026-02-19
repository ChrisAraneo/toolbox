import { toBuffer } from './to-buffer';

describe('toBuffer', () => {
  it('should convert a base64 string to a Buffer', () => {
    const original = Buffer.from([1, 2, 3, 4, 5]);
    const base64 = original.toString('base64');

    const result = toBuffer(base64);

    expect(result).toEqual(original);
  });

  it('should return a Buffer instance', () => {
    const base64 = Buffer.from('hello').toString('base64');

    const result = toBuffer(base64);

    expect(Buffer.isBuffer(result)).toBe(true);
  });

  it('should correctly decode known base64 input', () => {
    // "hello" in base64 is "aGVsbG8="
    const result = toBuffer('aGVsbG8=');

    expect(result).toEqual(Buffer.from('hello', 'utf-8'));
  });

  it('should produce a buffer of the correct byte length', () => {
    const original = Buffer.alloc(48, 7);
    const base64 = original.toString('base64');

    const result = toBuffer(base64);

    expect(result.length).toBe(48);
  });
});
