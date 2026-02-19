import { encryptContent } from './encrypt-content';

const makeMockCipher = (updateResult: Buffer, finalResult: Buffer) => ({
  update: jest.fn().mockReturnValue(updateResult),
  final: jest.fn().mockReturnValue(finalResult),
});

describe('encryptContent', () => {
  it('should return an object containing salt and iv from the input', () => {
    const salt = Buffer.alloc(16, 1);
    const iv = Buffer.alloc(16, 2);
    const cipher = makeMockCipher(Buffer.alloc(0), Buffer.alloc(0));

    const result = encryptContent({
      salt,
      iv,
      content: 'hello',
      password: 'pass',
      cipher,
    });

    expect(result.salt).toBe(salt);
    expect(result.iv).toBe(iv);
  });

  it('should return encrypted as the concatenation of cipher.update and cipher.final', () => {
    const salt = Buffer.alloc(16, 1);
    const iv = Buffer.alloc(16, 2);
    const updateResult = Buffer.from('encrypted-part');
    const finalResult = Buffer.from('-final');
    const cipher = makeMockCipher(updateResult, finalResult);

    const result = encryptContent({
      salt,
      iv,
      content: 'hello',
      password: 'pass',
      cipher,
    });

    expect(result.encrypted).toEqual(
      Buffer.concat([updateResult, finalResult]),
    );
  });

  it('should call cipher.update with the content and utf-8 encoding', () => {
    const salt = Buffer.alloc(16, 1);
    const iv = Buffer.alloc(16, 2);
    const cipher = makeMockCipher(Buffer.alloc(0), Buffer.alloc(0));

    encryptContent({
      salt,
      iv,
      content: 'my content',
      password: 'pass',
      cipher,
    });

    expect(cipher.update).toHaveBeenCalledWith('my content', 'utf-8');
  });

  it('should call cipher.final to flush the cipher', () => {
    const salt = Buffer.alloc(16, 1);
    const iv = Buffer.alloc(16, 2);
    const cipher = makeMockCipher(Buffer.alloc(0), Buffer.alloc(0));

    encryptContent({ salt, iv, content: 'data', password: 'pass', cipher });

    expect(cipher.final).toHaveBeenCalled();
  });
});
