const express = require("express");
const cors = require("cors");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x17a13c0afe26ca530b6be977143070d77609abc9": 100, // priv:  bdb944367c9e1b46ebff9637ca7a59d61e138d4dfa87fd0c6161470dbfb405ad
  "0x7682d4488c2e453ec1f9c314cb32dfb2ef2b58b4": 50, // priv: 71ccee0e8f481b18f9a56239d4f50ae62cd993aff23bc0f77b4cc08f5179514f
  "0xf0a79a8fac623537b8f6c61fd1183b38022b9e1b": 75, // priv: 01067011b2ab1c39d4cda24c90891b16ef1f0ce36ff3aa13521915a292521401
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
