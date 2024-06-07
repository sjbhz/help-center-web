import CryptoJS from "crypto-js";
const keyStrLocal = 'xxxxxxxxxxx'  // 加解密密钥
const keyVectLocal = 'xxxx'  // 加解密向量
//  AES/CTR模式/NoPadding
export default {
  // 加密
  encrypt(text, key, iv) {
    key = key ? key : keyStrLocal;
    iv = iv ? iv : keyVectLocal;
    // 将文本、密钥和初始向量转换为字节数组
    const textBytes = CryptoJS.enc.Utf8.parse(text);
    const keyBytes = CryptoJS.enc.Base64.parse(key);
    const ivBytes = CryptoJS.enc.Base64.parse(iv);

    // 执行加密操作
    const encrypted = CryptoJS.AES.encrypt(textBytes, keyBytes, {
      mode: CryptoJS.mode.CTR,
      iv: ivBytes,
      padding: CryptoJS.pad.NoPadding
    });

    // 返回加密后的密文
    return encrypted.toString();
  },

  decrypt(ciphertext, key, iv) {
    key = key ? key : keyStrLocal;
    iv = iv ? iv : keyVectLocal;
    // 将密文、密钥和初始向量转换为字节数组
    const keyBytes = CryptoJS.enc.Base64.parse(key);
    const ivBytes = CryptoJS.enc.Base64.parse(iv);
    const cipherTextBytes = CryptoJS.enc.Utf8.parse(ciphertext); //Base64编码
    const base64Str = CryptoJS.enc.Utf8.stringify(cipherTextBytes);

    // 执行解密操作
    const decrypted = CryptoJS.AES.decrypt(base64Str, keyBytes, {
        mode: CryptoJS.mode.CTR,
        iv: ivBytes,
        padding: CryptoJS.pad.NoPadding
      }
    );
    let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    // console.log("解密后的数据:",decryptedStr.toString())
    return decryptedStr.toString();
  }
};
