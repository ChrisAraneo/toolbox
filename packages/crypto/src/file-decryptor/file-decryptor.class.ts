import { createDecipheriv, createHash } from 'node:crypto';

import { Base64File } from '@chris.araneo/file-system';

import { EncryptedFile } from '../encrypted-file/encrypted-file.class';

const deriveKeyAndIV = (
  password: string,
  salt: Buffer,
  keyLength = 32,
  ivLength = 16,
): { key: Buffer; iv: Buffer } => {
  const hashes: Buffer[] = [];
  let hash = Buffer.alloc(0);
  let totalLength = 0;

  while (totalLength < keyLength + ivLength) {
    const data = Buffer.concat([hash, Buffer.from(password, 'utf-8'), salt]);
    hash = createHash('md5').update(data).digest();
    hashes.push(hash);
    totalLength += hash.length;
  }

  const combined = Buffer.concat(hashes);

  return {
    key: combined.subarray(0, keyLength),
    iv: combined.subarray(keyLength, keyLength + ivLength),
  };
};

const decryptAES = (encryptedContent: string, secretKey: string): string => {
  const encrypted = Buffer.from(encryptedContent, 'base64');

  const saltedPrefix = Buffer.from('Salted__', 'utf-8');
  if (!encrypted.subarray(0, 8).equals(saltedPrefix)) {
    throw new Error('Invalid encrypted data format');
  }

  const salt = encrypted.subarray(8, 16);
  const ciphertext = encrypted.subarray(16);

  const { key, iv } = deriveKeyAndIV(secretKey, salt);

  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf-8');
};

const decryptBase64File = (
  file: EncryptedFile,
  secretKey: string,
): Base64File =>
  new Base64File(
    file.getPath(),
    decryptAES(file.getContent(), secretKey),
    file.getModifiedDate(),
  );

const decryptBase64Files = (
  files: readonly EncryptedFile[],
  secretKey: string,
): Base64File[] => files.map((file) => decryptBase64File(file, secretKey));

export const FileDecryptor = {
  decryptBase64File,
  decryptBase64Files,
};
