import { bufferToUtf8 } from './buffer-to-utf8';

describe('bufferToUtf8', () => {
  it('should convert a Buffer to a utf-8 string', () => {
    const buffer = Buffer.from('hello world', 'utf-8');

    const result = bufferToUtf8(buffer);

    expect(result).toBe('hello world');
  });

  it('should return a string type', () => {
    const buffer = Buffer.from('test', 'utf-8');

    const result = bufferToUtf8(buffer);

    expect(typeof result).toBe('string');
  });

  it('should correctly decode utf-8 characters', () => {
    const original = 'café résumé';
    const buffer = Buffer.from(original, 'utf-8');

    const result = bufferToUtf8(buffer);

    expect(result).toBe(original);
  });

  it('should return an empty string for an empty buffer', () => {
    const buffer = Buffer.alloc(0);

    const result = bufferToUtf8(buffer);

    expect(result).toBe('');
  });
});
