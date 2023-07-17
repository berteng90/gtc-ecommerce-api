const express = require("express");
const paymentRouter = express.Router();
const dotenv = require("dotenv").config();

paymentRouter.get("/paymentID", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Basic c2tfdGVzdF9YdENzWXdRTnU4QlA4dll6Q1hzWTh4cEU6",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: 10000,
          payment_method_allowed: ["gcash"],
          currency: "PHP",
          description: "Invoice Number: 0000001",
        },
      },
    }),
  };
  try {
    const response = await fetch(
      "https://api.paymongo.com/v1/payment_intents",
      options
    );
    const data = await response.json();
    console.log(data);
    res.send(data).status(200);
  } catch (error) {}
});

paymentRouter.get("/paymentMethod", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Basic c2tfdGVzdF9YdENzWXdRTnU4QlA4dll6Q1hzWTh4cEU6",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: {
            address: {
              line1: "Carlos Fortich Street",
              line2: "Purok 9 Sur",
              city: "Don Carlos",
              state: "Bukidnon",
              postal_code: "8712",
              country: "PH",
            },
            name: "Englebert Garay",
            email: "berteng90@gmail.com",
            phone: "09066022039",
          },
          type: "gcash",
        },
      },
    }),
  };

  try {
    const response = await fetch(
      "https://api.paymongo.com/v1/payment_methods",
      options
    );
    const data = await response.json();
    console.log(data);
    res.send(data).status(200);
  } catch (error) {}
});

paymentRouter.get("/attach", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Basic ${process.env.PAYMONGO_TESTKEY}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          payment_method: "pm_QgnHzXPspGv29sBDN5Zu5gZH",
          client_key:
            "pi_7MWcxRU2BJr5JN5q9HhvhNkZ_client_5b4Jv2dzJcGBYEURovCM43cQ",
          return_url: "https://example.com/success",
        },
      },
    }),
  };

  try {
    const response = await fetch(
      `https://api.paymongo.com/v1/payment_intents/pi_7MWcxRU2BJr5JN5q9HhvhNkZ/attach`
    );
    const data = await response.json();
    console.log(data);
    res.send(data).status(200);
  } catch (error) {}
});

paymentRouter.post("/checkout", async (req, res) => {
  const checkoutInfo = req.body;
  console.log(JSON.stringify(checkoutInfo));
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
