import { Base64File } from '@chris.araneo/file-system';

import { FileDecryptor } from '../file-decryptor/file-decryptor.class';
import { EncryptedFile } from '../encrypted-file/encrypted-file.class';
import { FileEncryptor } from './file-encryptor.class';

describe('FileEncryptor', () => {
  it('#encryptBase64File should encrypt base64 file', async () => {
    const file = new Base64File(
      'test.txt',
      'Hello World!',
      new Date('2023-11-13'),
    );

    const result = FileEncryptor.encryptBase64File(file, 'secret');

    // Verify it's encrypted (base64 format)
    expect(result.content).toMatch(/^[A-Za-z0-9+/]+=*$/);

    // Verify it can be decrypted back
    const encryptedFile = EncryptedFile.fromBase64File(file, 'secret');
    const decrypted = FileDecryptor.decryptBase64File(encryptedFile, 'secret');

    expect(decrypted.getContent()).toBe('Hello World!');
  });

  it('#encryptBase64Files should encrypt base64 file', async () => {
    const files = [
      new Base64File('test1.txt', 'First file', new Date('2024-10-10')),
      new Base64File('test2.txt', 'Second file', new Date('2024-11-11')),
    ];

    const result = FileEncryptor.encryptBase64Files(files, 'secret');

    // Verify both are encrypted
    expect(result[0].content).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(result[1].content).toMatch(/^[A-Za-z0-9+/]+=*$/);

    // Verify they can be decrypted back
    const encryptedFiles = files.map(file => EncryptedFile.fromBase64File(file, 'secret'));
    const decrypted = FileDecryptor.decryptBase64Files(encryptedFiles, 'secret');

    expect(decrypted[0].getContent()).toBe('First file');
    expect(decrypted[1].getContent()).toBe('Second file');
  });

  it('#encryptBase64File should throw error when provided incorrect file', async () => {
    expect(() =>
      FileEncryptor.encryptBase64File(null as unknown as Base64File, 'secret'),
    ).toThrow();
  });
});
