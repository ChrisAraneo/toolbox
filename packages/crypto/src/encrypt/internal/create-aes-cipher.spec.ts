import * as aes from 'browserify-aes';

import { createAesCipher } from './create-aes-cipher';

jest.mock('browserify-aes');

describe('createAesCipher', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call createCipheriv with aes-256-cbc algorithm, key, and iv', () => {
    const key = Buffer.alloc(32, 1);
    const iv = Buffer.alloc(16, 2);
    const salt = Buffer.alloc(16, 3);
    const mockCipher = {};

    (aes.createCipheriv as jest.Mock).mockReturnValue(mockCipher);

    createAesCipher({ key, iv, salt, content: 'data', password: 'pass' });

    expect(aes.createCipheriv).toHaveBeenCalledWith('aes-256-cbc', key, iv);
  });

  it('should return an object containing iv, salt, content, password, and cipher', () => {
    const key = Buffer.alloc(32, 1);
    const iv = Buffer.alloc(16, 2);
    const salt = Buffer.alloc(16, 3);
    const content = 'test content';
    const password = 'test password';
    const mockCipher = { update: jest.fn(), final: jest.fn() };

    (aes.createCipheriv as jest.Mock).mockReturnValue(mockCipher);

    const result = createAesCipher({ key, iv, salt, content, password });

    expect(result).toEqual({ iv, salt, content, password, cipher: mockCipher });
  });

  it('should pass the cipher returned by createCipheriv without modification', () => {
    const key = Buffer.alloc(32, 1);
    const iv = Buffer.alloc(16, 2);
    const salt = Buffer.alloc(16, 3);
    const mockCipher = { id: 'unique-cipher-instance' };

    (aes.createCipheriv as jest.Mock).mockReturnValue(mockCipher);

    const result = createAesCipher({
      key,
      iv,
      salt,
      content: 'c',
      password: 'p',
    });

    expect(result.cipher).toBe(mockCipher);
  });
});
