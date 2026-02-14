import { Base64File } from '@chris.araneo/file-system';
import { EncryptionResult } from './encryption-result.type';
import * as aes from 'browserify-aes';
import { chain } from 'lodash';
import { randomBytes, scryptSync } from 'node:crypto';

const createAesCipher = (input: {
  key: Buffer;
  iv: Buffer;
  salt: Buffer;
  content: string;
  password: string;
}) => ({
  iv: input.iv,
  salt: input.salt,
  content: input.content,
  password: input.password,
  cipher: aes.createCipheriv('aes-256-cbc', input.key, input.iv),
});

const encryptContent = (input: ReturnType<typeof createAesCipher>) => ({
  salt: input.salt,
  iv: input.iv,
  encrypted: Buffer.concat([
    input.cipher.update(input.content, 'utf-8'),
    input.cipher.final(),
  ]),
});

const concatToBase64 = (input: ReturnType<typeof encryptContent>): string =>
  Buffer.concat([input.salt, input.iv, input.encrypted]).toString('base64');

const encryptAES = (content: string, password: string): string =>
  chain({
    salt: randomBytes(16),
    key: scryptSync(password, randomBytes(16), 32),
    iv: randomBytes(16),
    content,
    password,
  })
    .thru(createAesCipher)
    .thru(encryptContent)
    .thru(concatToBase64)
    .value() as string;

export const encryptBase64File = (
  file: Base64File,
  secret: string,
): EncryptionResult => ({
  path: file.getPath(),
  content: encryptAES(file.getContent(), secret),
});
