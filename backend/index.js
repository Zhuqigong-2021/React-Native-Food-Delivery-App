require("dotenv").config();
const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(
  "screte_key"
);
const app = express();

const PORT = 8080;
app.use(express.json());

app.use(cors());

app.post("/pay", async (req, res) => {
  try {
    const { name, totalAmount } = req.body;
    console.log(name);
    if (!name || !totalAmount)
      return res
        .status(400)
        .json({ message: "Please enter your payment total amount " });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "cad",
      //   payment_method_types: ["card"],
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ paymentIntent: paymentIntent.client_secret });

    console.log(paymentIntent.client_secret);
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
