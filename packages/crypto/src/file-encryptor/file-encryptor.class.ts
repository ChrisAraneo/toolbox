import { Base64File } from '@chris.araneo/file-system';
import CryptoJS from 'crypto-js';
import CryptoAES from 'crypto-js/aes';

import { EncryptionResult } from './encryption-result.type';

export const FileEncryptor = {
  encryptBase64Files(
    files: Base64File[],
    secretKey: string,
  ): EncryptionResult[] {
    return files.map((textFile: Base64File) =>
      this.encryptBase64File(textFile, secretKey),
    );
  },

  encryptBase64File(file: Base64File, secretKey: string): EncryptionResult {
    return {
      path: file.getPath(),
      content: CryptoAES.encrypt(file.getContent(), secretKey).toString(
        CryptoJS.format.OpenSSL,
      ),
    };
  },
};
