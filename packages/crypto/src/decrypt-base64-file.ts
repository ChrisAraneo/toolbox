import { scryptSync } from 'node:crypto';

import { Base64File } from '@chris.araneo/file-system';
import * as aes from 'browserify-aes';
import { chain } from 'lodash';
import { EncryptedFile } from './encrypted-file.class';

const decryptAES = (encryptedContent: string, password: string): string =>
  chain(Buffer.from(encryptedContent, 'base64') as unknown)
    .thru((data) => {
      const buffer = data as Buffer;
      return {
        salt: buffer.subarray(0, 16),
        iv: buffer.subarray(16, 32),
        encrypted: buffer.subarray(32),
      };
    })
    .thru(({ salt, iv, encrypted }) => ({
      iv,
      encrypted,
      key: scryptSync(password, salt, 32),
    }))
    .thru(({ key, iv, encrypted }) => ({
      decipher: aes.createDecipheriv('aes-256-cbc', key, iv),
      encrypted,
    }))
    .thru(({ decipher, encrypted }) =>
      Buffer.concat([decipher.update(encrypted), decipher.final()]),
    )
    .thru((decrypted) => (decrypted as unknown as Buffer).toString('utf-8'))
    .value() as string;

export const decryptBase64File = (
  file: EncryptedFile,
  secretKey: string,
): Base64File =>
  new Base64File(
    file.getPath(),
    decryptAES(file.getContent(), secretKey),
    file.getModifiedDate(),
  );
