const express = require("express");
const cors = require("cors");
const { Crypto } = require("./lib/Crypto");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1c04669378c5394877b6b9cf752ce2dade217e1c": 100, // priv:  bdb944367c9e1b46ebff9637ca7a59d61e138d4dfa87fd0c6161470dbfb405ad
  "0x811bd48da3ecf9782c4afaa1c671f736d0d9c892": 50, // priv: 71ccee0e8f481b18f9a56239d4f50ae62cd993aff23bc0f77b4cc08f5179514f
  "0xa7ea104536b9e6b04dc77b46896087c5c4eaf5cd": 75, // priv: 01067011b2ab1c39d4cda24c90891b16ef1f0ce36ff3aa13521915a292521401
};

const crypto = new Crypto();

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, rBit } = req.body;

  const ethAddress = verifySignature(amount.toString(), signature, rBit);

  if (ethAddress && ethAddress === sender) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      return res.send({ balance: balances[sender] });
    }
  }

  res.status(401).send(new Error());
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function verifySignature(msg, signature, rBit) {
  const pubKey = crypto.recoverKey(msg, signature, rBit);
  const ethAddr = crypto.keyToAddress(pubKey);

  if (balances[ethAddr]) return ethAddr;

  return false;
}
