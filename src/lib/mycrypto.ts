import { RegisterUser } from '../ressources/types';

export const registerUser = async (user: RegisterUser, key: CryptoKey) => {
  var enc = new TextEncoder(); // always utf-8
  window.crypto.subtle
    .encrypt(
      {
        name: 'AES-CTR',
        //Don't re-use counters!
        //Always use a new counter every time your encrypt!
        counter: new Uint8Array(16),
        length: 128, //can be 1-128
      },
      key, //from generateKey or importKey above
      enc.encode(JSON.stringify(user)) //ArrayBuffer of data you want to encrypt
    )
    .then(function (encrypted) {
      //returns an ArrayBuffer containing the encrypted data
      console.log(_arrayBufferToBase64(new Uint8Array(encrypted)));

      console.log(readUser(encrypted, key));
    })
    .catch(function (err) {
      console.error(err);
    });
};

function _arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export const decrypt = (data: ArrayBuffer, key: CryptoKey) =>
  window.crypto.subtle.decrypt(
    {
      name: 'AES-CTR',
      counter: new ArrayBuffer(16), //The same counter you used to encrypt
      length: 128, //The same length you used to encrypt
    },
    key, //from generateKey or importKey above
    data //ArrayBuffer of the data
  );

export const readUser = (data: ArrayBuffer, key: CryptoKey) => {
  decrypt(data, key)
    .then((decrypted) => {
      //returns an ArrayBuffer containing the decrypted data
      console.log(decrypted);
      const decoder = new TextDecoder();
      console.log(JSON.parse(decoder.decode(decrypted)));
    })
    .catch((err) => {
      console.error(err);
    });
};

export async function generateKey(cb: (key: CryptoKey) => void) {
  return window.crypto.subtle
    .generateKey(
      {
        name: 'AES-CTR',
        length: 128,
      },
      true,
      ['encrypt', 'decrypt']
    )
    .then((key) => {
      cb(key);
    });
}
