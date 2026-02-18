import * as cryptoModule from 'crypto';

import { concatToBase64 } from './concat-to-base64';
import { createAesCipher } from './create-aes-cipher';
import { encryptContent } from './encrypt-content';
import { encryptAES } from './encrypt-aes';

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
  scryptSync: jest.fn(),
}));
jest.mock('./create-aes-cipher');
jest.mock('./encrypt-content');
jest.mock('./concat-to-base64');

describe('encryptAES', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupMocks = () => {
    const salt = Buffer.alloc(16, 0);
    const scryptSalt = Buffer.alloc(16, 5);
    const key = Buffer.alloc(32, 1);
    const iv = Buffer.alloc(16, 2);
    const mockCipherObj = { cipher: {}, salt, iv, content: 'data', password: 'pass' };
    const mockEncryptedObj = { salt, iv, encrypted: Buffer.alloc(16, 3) };
    const expectedBase64 = 'expectedBase64==';

    (cryptoModule.randomBytes as jest.Mock)
      .mockReturnValueOnce(salt)
      .mockReturnValueOnce(scryptSalt)
      .mockReturnValueOnce(iv);
    (cryptoModule.scryptSync as jest.Mock).mockReturnValue(key);
    (createAesCipher as jest.Mock).mockReturnValue(mockCipherObj);
    (encryptContent as jest.Mock).mockReturnValue(mockEncryptedObj);
    (concatToBase64 as jest.Mock).mockReturnValue(expectedBase64);

    return { salt, key, iv, mockCipherObj, mockEncryptedObj, expectedBase64 };
  };

  it('should return the result of concatToBase64', () => {
    const { expectedBase64 } = setupMocks();

    const result = encryptAES('data', 'pass');

    expect(result).toBe(expectedBase64);
  });

  it('should call createAesCipher with salt, key, iv, content, and password', () => {
    const { salt, key, iv } = setupMocks();

    encryptAES('data', 'pass');

    expect(createAesCipher).toHaveBeenCalledWith(
      expect.objectContaining({ salt, key, iv, content: 'data', password: 'pass' }),
    );
  });

  it('should call encryptContent with the result of createAesCipher', () => {
    const { mockCipherObj } = setupMocks();

    encryptAES('data', 'pass');

    expect(encryptContent).toHaveBeenCalledWith(mockCipherObj);
  });

  it('should call concatToBase64 with the result of encryptContent', () => {
    const { mockEncryptedObj } = setupMocks();

    encryptAES('data', 'pass');

    expect(concatToBase64).toHaveBeenCalledWith(mockEncryptedObj);
  });
});
