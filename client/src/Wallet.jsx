import { useState, useEffect } from "react";

import server from "./server";

// const balances = {
//   "0x17a13c0afe26ca530b6be977143070d77609abc9": 100, // priv:  bdb944367c9e1b46ebff9637ca7a59d61e138d4dfa87fd0c6161470dbfb405ad
//   "0x7682d4488c2e453ec1f9c314cb32dfb2ef2b58b4": 50, // priv: 71ccee0e8f481b18f9a56239d4f50ae62cd993aff23bc0f77b4cc08f5179514f
//   "0xf0a79a8fac623537b8f6c61fd1183b38022b9e1b": 75, // priv: 01067011b2ab1c39d4cda24c90891b16ef1f0ce36ff3aa13521915a292521401
// };

function Wallet(
  { address,
    setAddress,
    balance,
    setBalance,
    privateKey,
    setPrivateKey,
  }
) {
  const [canSign, setCanSign] = useState(false)
  async function getBalance() {
    try {
      const { data } = await server.get(`balance/${address}`);
      if (!data.balance) return console.error(data)
      setBalance(data.balance)
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  useEffect(() => {
    if (address.length === 0) {
      setBalance(0)
      setCanSign(false)
      return
    }
    getBalance()
    setCanSign(true)
  }, [address])

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet address
        <div className="inputs-container">
          <input
            placeholder="Your wallet address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></input>
          {canSign ? (
            <input
              placeholder="Your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              type="password"
            >
            </input>
          ) : <></>}
        </div>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
