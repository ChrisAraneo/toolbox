import { bufferToUtf8 } from './buffer-to-utf8';
import { createAesDecipher } from './create-aes-decipher';
import { decryptAES } from './decrypt-aes';
import { decryptContent } from './decrypt-content';
import { deriveKey } from './derive-key';
import { splitEncryptedBuffer } from './split-encrypted-buffer';
import { toBuffer } from './to-buffer';

jest.mock('./to-buffer');
jest.mock('./split-encrypted-buffer');
jest.mock('./derive-key');
jest.mock('./create-aes-decipher');
jest.mock('./decrypt-content');
jest.mock('./buffer-to-utf8');

describe('decryptAES', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupMocks = () => {
    const rawBuffer = Buffer.alloc(64, 0);
    const splitResult = {
      salt: Buffer.alloc(16, 1),
      iv: Buffer.alloc(16, 2),
      encrypted: Buffer.alloc(32, 3),
    };
    const deriveKeyResult = {
      key: Buffer.alloc(32, 4),
      iv: splitResult.iv,
      encrypted: splitResult.encrypted,
    };
    const decipherResult = { decipher: {}, encrypted: splitResult.encrypted };
    const decryptedBuffer = Buffer.from('plaintext', 'utf-8');
    const expectedString = 'plaintext';

    (toBuffer as jest.Mock).mockReturnValue(rawBuffer);
    (splitEncryptedBuffer as jest.Mock).mockReturnValue(splitResult);
    const deriveKeyFn = jest.fn().mockReturnValue(deriveKeyResult);
    (deriveKey as jest.Mock).mockReturnValue(deriveKeyFn);
    (createAesDecipher as jest.Mock).mockReturnValue(decipherResult);
    (decryptContent as jest.Mock).mockReturnValue(decryptedBuffer);
    (bufferToUtf8 as jest.Mock).mockReturnValue(expectedString);

    return {
      rawBuffer,
      splitResult,
      deriveKeyFn,
      deriveKeyResult,
      decipherResult,
      decryptedBuffer,
      expectedString,
    };
  };

  it('should return the final utf-8 string from bufferToUtf8', () => {
    const { expectedString } = setupMocks();

    const result = decryptAES('base64content==', 'password');

    expect(result).toBe(expectedString);
  });

  it('should call toBuffer with the encrypted content', () => {
    setupMocks();

    decryptAES('base64content==', 'password');

    expect(toBuffer).toHaveBeenCalledWith('base64content==');
  });

  it('should call splitEncryptedBuffer with the result of toBuffer', () => {
    const { rawBuffer } = setupMocks();

    decryptAES('base64content==', 'password');

    expect(splitEncryptedBuffer).toHaveBeenCalledWith(rawBuffer);
  });

  it('should call deriveKey with the password', () => {
    setupMocks();

    decryptAES('base64content==', 'my-password');

    expect(deriveKey).toHaveBeenCalledWith('my-password');
  });

  it('should call createAesDecipher with the result of deriveKey', () => {
    const { deriveKeyResult } = setupMocks();

    decryptAES('base64content==', 'password');

    expect(createAesDecipher).toHaveBeenCalledWith(deriveKeyResult);
  });

  it('should call decryptContent with the result of createAesDecipher', () => {
    const { decipherResult } = setupMocks();

    decryptAES('base64content==', 'password');

    expect(decryptContent).toHaveBeenCalledWith(decipherResult);
  });

  it('should call bufferToUtf8 with the result of decryptContent', () => {
    const { decryptedBuffer } = setupMocks();

    decryptAES('base64content==', 'password');

    expect(bufferToUtf8).toHaveBeenCalledWith(decryptedBuffer);
  });
});
