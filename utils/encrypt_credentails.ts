import * as CryptoJSUtils from "crypto-js";
import * as fs from "fs";

const SALT = process.env.SALT || "2025March";

export function encrypt(text: string) {
  const cipherText = CryptoJSUtils.AES.encrypt(text, SALT).toString();
  return cipherText;
}

export function decrypt(cipherText: string) {
  const bytes = CryptoJSUtils.AES.decrypt(cipherText, SALT);
  const originalText = bytes.toString(CryptoJSUtils.enc.Utf8);
  return originalText;
}

export function update_credentials_config(
  filePath: string,
  key: string,
  newValue: any
): void {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(data);
    jsonData[key] = newValue;
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  } catch (error) {
    console.log(`Error updating JSON file: ${error}`);
  }
}
