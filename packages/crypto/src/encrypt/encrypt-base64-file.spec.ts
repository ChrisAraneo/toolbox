import { encryptBase64File } from './encrypt-base64-file';
import { encryptAES } from './internal/encrypt-aes';

jest.mock('./internal/encrypt-aes');

describe('encryptBase64File', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an object with path and encryptedContent', () => {
    const path = '/some/file.txt';
    const content = 'file content';
    const secret = 'my-secret';
    const encryptedResult = 'encryptedBase64String==';

    (encryptAES as jest.Mock).mockReturnValue(encryptedResult);

    const result = encryptBase64File(path, content, secret);

    expect(result).toEqual({ path, encryptedContent: encryptedResult });
  });

  it('should call encryptAES with content and secret', () => {
    const path = '/some/file.txt';
    const content = 'file content';
    const secret = 'my-secret';

    (encryptAES as jest.Mock).mockReturnValue('encrypted');

    encryptBase64File(path, content, secret);

    expect(encryptAES).toHaveBeenCalledWith(content, secret);
  });

  it('should preserve the original path without modification', () => {
    const path = '/deeply/nested/path/file.b64';

    (encryptAES as jest.Mock).mockReturnValue('enc');

    const result = encryptBase64File(path, 'data', 'secret');

    expect(result.path).toBe(path);
  });
});
