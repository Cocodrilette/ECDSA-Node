import server from "./server";
import { getPublicKey } from "ethereum-cryptography/secp256k1"
import { keccak256 } from "ethereum-cryptography/keccak"
import { bytesToHex, hexToBytes } from "ethereum-cryptography/utils"

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const _privateKey = evt.target.value;
    setPrivateKey(_privateKey)

    const pubKey = getPublicKey(hexToBytes(privateKey));
    const ethAddress = `0x${bytesToHex(keccak256(pubKey).slice(-20))}`;
    setAddress(ethAddress);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <p className="address">Address: {address || "..."}</p>
        <input
          placeholder="Write your private key"
          value={privateKey}
          onChange={onChange}
          type="password"
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
