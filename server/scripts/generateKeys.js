const secp = require("ethereum-cryptography/secp256k1");
const { bytesToHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();
const pubKey = secp.getPublicKey(privateKey);
const ethAddress = keccak256(pubKey).slice(-20);

console.log("Private key:", bytesToHex(privateKey));
console.log("Public key:", bytesToHex(pubKey));
console.log("ETH Address:", `0x${bytesToHex(ethAddress)}`);
