import { createCipheriv, createHash, randomBytes } from 'node:crypto';

import { Base64File } from '@chris.araneo/file-system';

import { EncryptionResult } from './encryption-result.type';

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

const encryptAES = (content: string, secretKey: string): string => {
  const salt = randomBytes(8);
  const { key, iv } = deriveKeyAndIV(secretKey, salt);

  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(content, 'utf-8'),
    cipher.final(),
  ]);

  const result = Buffer.concat([
    Buffer.from('Salted__', 'utf-8'),
    salt,
    encrypted,
  ]);

  return result.toString('base64');
};

const encryptBase64File = (
  file: Base64File,
  secretKey: string,
): EncryptionResult => ({
  path: file.getPath(),
  content: encryptAES(file.getContent(), secretKey),
});

const encryptBase64Files = (
  files: readonly Base64File[],
  secretKey: string,
): EncryptionResult[] => files.map((file) => encryptBase64File(file, secretKey));

export const FileEncryptor = {
  encryptBase64File,
  encryptBase64Files,
};
