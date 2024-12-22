import { Base64File } from '@chris.araneo/file-system';
import CryptoJS from 'crypto-js';
import CryptoAES from 'crypto-js/aes';

import { EncryptedFile } from './models/encrypted-file.class';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FileDecryptor {
  static decryptBase64Files(
    files: EncryptedFile[],
    secretKey: string,
  ): Base64File[] {
    return files.map((files: EncryptedFile) =>
      this.decryptBase64File(files, secretKey),
    );
  }

  static decryptBase64File(file: EncryptedFile, secretKey: string): Base64File {
    return new Base64File(
      file.getPath(),
      CryptoAES.decrypt(file.getContent(), secretKey).toString(
        CryptoJS.enc.Utf8,
      ),
      file.getModifiedDate(),
    );
  }
}
