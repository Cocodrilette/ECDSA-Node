const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, bytesToHex } = require("ethereum-cryptography/utils");

class Crypto {
  hashString(str) {
    return keccak256(utf8ToBytes(str));
  }

  recoverKey(msg, signature, rBit) {
    const publicKey = secp.recoverPublicKey(
      this.hashString(msg),
      signature,
      rBit
    );
    return publicKey;
  }

  keyToAddress(publicKey) {
    const pubKey = publicKey.slice(1);
    const ethAddress = keccak256(pubKey).slice(-20);
    return `0x${bytesToHex(ethAddress)}`;
  }
}

module.exports = { Crypto };
