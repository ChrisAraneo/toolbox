import { Base64File } from '@chris.araneo/file-system';
import cryptoJs from 'crypto-js';
import cryptoAes from 'crypto-js/aes';

import { EncryptedFile } from '../encrypted-file/encrypted-file.class';

export const FileDecryptor = {
  decryptBase64Files(files: EncryptedFile[], secretKey: string): Base64File[] {
    return files.map((file: EncryptedFile) =>
      this.decryptBase64File(file, secretKey),
    );
  },

  decryptBase64File(file: EncryptedFile, secretKey: string): Base64File {
    return new Base64File(
      file.getPath(),
      cryptoAes
        .decrypt(file.getContent(), secretKey)
        .toString(cryptoJs.enc.Utf8),
      file.getModifiedDate(),
    );
  },
};
