import * as aes from 'browserify-aes';

import { createAesDecipher } from './create-aes-decipher';

jest.mock('browserify-aes');

describe('createAesDecipher', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call createDecipheriv with aes-256-cbc algorithm, key, and iv', () => {
    const key = Buffer.alloc(32, 1);
    const iv = Buffer.alloc(16, 2);
    const encrypted = Buffer.alloc(16, 3);
    const mockDecipher = {};

    (aes.createDecipheriv as jest.Mock).mockReturnValue(mockDecipher);

    createAesDecipher({ key, iv, encrypted });

    expect(aes.createDecipheriv).toHaveBeenCalledWith('aes-256-cbc', key, iv);
  });

  it('should return an object containing the decipher and encrypted buffer', () => {
    const key = Buffer.alloc(32, 1);
    const iv = Buffer.alloc(16, 2);
    const encrypted = Buffer.alloc(16, 3);
    const mockDecipher = { update: jest.fn(), final: jest.fn() };

    (aes.createDecipheriv as jest.Mock).mockReturnValue(mockDecipher);

    const result = createAesDecipher({ key, iv, encrypted });

    expect(result).toEqual({ decipher: mockDecipher, encrypted });
  });

  it('should pass the decipher returned by createDecipheriv without modification', () => {
    const key = Buffer.alloc(32, 1);
    const iv = Buffer.alloc(16, 2);
    const encrypted = Buffer.alloc(16, 3);
    const mockDecipher = { id: 'unique-decipher-instance' };

    (aes.createDecipheriv as jest.Mock).mockReturnValue(mockDecipher);

    const result = createAesDecipher({ key, iv, encrypted });

    expect(result.decipher).toBe(mockDecipher);
  });

  it('should pass the encrypted buffer through without modification', () => {
    const key = Buffer.alloc(32, 1);
    const iv = Buffer.alloc(16, 2);
    const encrypted = Buffer.from([9, 8, 7]);

    (aes.createDecipheriv as jest.Mock).mockReturnValue({});

    const result = createAesDecipher({ key, iv, encrypted });

    expect(result.encrypted).toBe(encrypted);
  });
});
