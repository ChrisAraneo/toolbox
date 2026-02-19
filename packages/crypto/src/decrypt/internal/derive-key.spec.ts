import * as nodeCrypto from 'node:crypto';

import { deriveKey } from './derive-key';

jest.mock('node:crypto', () => ({
  scryptSync: jest.fn(),
}));

describe('deriveKey', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call scryptSync with the password, salt, and 32 as key length', () => {
    const password = 'my-secret';
    const salt = Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 1);
    const encrypted = Buffer.alloc(16, 2);
    const derivedKey = Buffer.alloc(32, 9);

    (nodeCrypto.scryptSync as jest.Mock).mockReturnValue(derivedKey);

    deriveKey(password)({ salt, iv, encrypted });

    expect(nodeCrypto.scryptSync).toHaveBeenCalledWith(password, salt, 32);
  });

  it('should return an object with key, iv, and encrypted', () => {
    const password = 'pass';
    const salt = Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 1);
    const encrypted = Buffer.alloc(16, 2);
    const derivedKey = Buffer.alloc(32, 9);

    (nodeCrypto.scryptSync as jest.Mock).mockReturnValue(derivedKey);

    const result = deriveKey(password)({ salt, iv, encrypted });

    expect(result).toEqual({ key: derivedKey, iv, encrypted });
  });

  it('should pass iv through without modification', () => {
    const password = 'pass';
    const salt = Buffer.alloc(16, 0);
    const iv = Buffer.from([10, 20, 30]);
    const encrypted = Buffer.alloc(16, 2);
    const derivedKey = Buffer.alloc(32, 9);

    (nodeCrypto.scryptSync as jest.Mock).mockReturnValue(derivedKey);

    const result = deriveKey(password)({ salt, iv, encrypted });

    expect(result.iv).toBe(iv);
  });

  it('should pass encrypted through without modification', () => {
    const password = 'pass';
    const salt = Buffer.alloc(16, 0);
    const iv = Buffer.alloc(16, 1);
    const encrypted = Buffer.from([7, 8, 9]);
    const derivedKey = Buffer.alloc(32, 9);

    (nodeCrypto.scryptSync as jest.Mock).mockReturnValue(derivedKey);

    const result = deriveKey(password)({ salt, iv, encrypted });

    expect(result.encrypted).toBe(encrypted);
  });

  it('should be curried and return a function when called with password', () => {
    const fn = deriveKey('password');

    expect(typeof fn).toBe('function');
  });
});
