import { Base64File } from '@chris.araneo/file-system';
import CryptoJS from 'crypto-js';
import CryptoAES from 'crypto-js/aes';

import { EncryptionResult } from './encryption-result.type';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FileEncryptor {
  static encryptBase64Files(
    files: Base64File[],
    secretKey: string,
  ): EncryptionResult[] {
    return files.map((textFile: Base64File) =>
      this.encryptBase64File(textFile, secretKey),
    );
  }

  static encryptBase64File(
    file: Base64File,
    secretKey: string,
  ): EncryptionResult {
    return {
      path: file.getPath(),
      content: CryptoAES.encrypt(file.getContent(), secretKey).toString(
        CryptoJS.format.OpenSSL,
      ),
    };
  }
}
