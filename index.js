const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");

require("dotenv").config();

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.post("/makepayment", (req, res) => {
  let { amount, orderId } = req.body;
  instance.orders
    .create({
      amount: amount,
      currency: "INR",
      receipt: orderId,
    })
    .then((result) => {
      console.log(result);
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    });
});

app.post("/verifypayment", (req, res) => {
  console.log(req.body);
  const id = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  var sign = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(id)
    .digest("hex");

  if (sign === req.body.razorpay_signature) {
    console.log("payment succces");
    res.status(200).json("Payment Succesful");
  } else {
    console.log("went wrong");
    res.status(400).json("went wrong");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
