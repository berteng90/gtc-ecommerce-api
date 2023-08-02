const express = require("express");
const paymentRouter = express.Router();
const dotenv = require("dotenv").config();

paymentRouter.post("/checkout", async (req, res) => {
  const checkoutInfo = req.body;
  try {
    const response = await fetch(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Basic ${process.env.PAYMONGO_TESTKEY}`,
        },
        body: JSON.stringify(checkoutInfo),
      }
    );
    const data = await response.json();
    const checkoutURL = data.data.attributes.checkout_url;
    return res.status(200).json({ checkoutURL: checkoutURL });
  } catch (error) {
    console.log(error);
  }
});

module.exports = paymentRouter;
