import * as crypto from 'crypto'
export class Encrypt {
    static secretKey:string;
    static setSecretKey(secretKey:string){
        if(secretKey.length < 32) throw 'key error';
        Encrypt.secretKey = secretKey;
    }
    static encryptAES256(text:string){
        if(Encrypt.secretKey.length < 32) throw 'encrypt key error';
        const iv = Encrypt.secretKey.substring(0, 16);
        const cipher = crypto.createCipheriv(`aes-256-cbc`, Encrypt.secretKey, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return encrypted.toString('hex');
    }
    static decryptAES256(text:string){
        if(Encrypt.secretKey.length < 32) throw 'decrypt key error';
        const iv = Encrypt.secretKey.substring(0, 16);
        const cipher = crypto.createDecipheriv(`aes-256-cbc`, Encrypt.secretKey, iv);
        const decrypted  = Buffer.concat([cipher.update(Buffer.from(text, 'hex')), cipher.final()]);
        return decrypted.toString();
    }
}