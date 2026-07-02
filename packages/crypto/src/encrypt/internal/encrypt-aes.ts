import { randomBytes, scryptSync } from 'node:crypto';

import { chain } from 'lodash';

import { concatToBase64 } from './concat-to-base64';
import { createAesCipher } from './create-aes-cipher';
import { encryptContent } from './encrypt-content';

export const encryptAES = (content: string, password: string): string =>
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
    .value();
