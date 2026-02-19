import { decryptContent } from './decrypt-content';

const makeMockDecipher = (updateResult: Buffer, finalResult: Buffer) => ({
  update: jest.fn().mockReturnValue(updateResult),
  final: jest.fn().mockReturnValue(finalResult),
});

describe('decryptContent', () => {
  it('should call decipher.update with the encrypted buffer', () => {
    const encrypted = Buffer.from([1, 2, 3]);
    const decipher = makeMockDecipher(Buffer.alloc(0), Buffer.alloc(0));

    decryptContent({ decipher, encrypted });

    expect(decipher.update).toHaveBeenCalledWith(encrypted);
  });

  it('should call decipher.final to flush the decipher', () => {
    const encrypted = Buffer.from([1, 2, 3]);
    const decipher = makeMockDecipher(Buffer.alloc(0), Buffer.alloc(0));

    decryptContent({ decipher, encrypted });

    expect(decipher.final).toHaveBeenCalled();
  });

  it('should return the concatenation of decipher.update and decipher.final results', () => {
    const encrypted = Buffer.from([1, 2, 3]);
    const updateResult = Buffer.from('decrypted-part');
    const finalResult = Buffer.from('-final');
    const decipher = makeMockDecipher(updateResult, finalResult);

    const result = decryptContent({ decipher, encrypted });

    expect(result).toEqual(Buffer.concat([updateResult, finalResult]));
  });

  it('should return a Buffer', () => {
    const encrypted = Buffer.alloc(16, 5);
    const decipher = makeMockDecipher(Buffer.from('data'), Buffer.alloc(0));

    const result = decryptContent({ decipher, encrypted });

    expect(Buffer.isBuffer(result)).toBe(true);
  });
});
