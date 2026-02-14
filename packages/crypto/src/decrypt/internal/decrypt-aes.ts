import { chain } from 'lodash';
import { bufferToUtf8 } from './buffer-to-utf8';
import { createAesDecipher } from './create-aes-decipher';
import { decryptContent } from './decrypt-content';
import { deriveKey } from './derive-key';
import { splitEncryptedBuffer } from './split-encrypted-buffer';
import { toBuffer } from './to-buffer';

export const decryptAES = (
  encryptedContent: string,
  password: string,
): string =>
  chain(toBuffer(encryptedContent))
    .thru(splitEncryptedBuffer)
    .thru(deriveKey(password))
    .thru(createAesDecipher)
    .thru(decryptContent)
    .thru(bufferToUtf8)
    .value();
