const express = require("express");
const router = express.Router();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/config", async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: ["sample_basic", "sample_plus", "sample_premium"],
    expand: ["data.product"],
  });

  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    prices: prices.data,
  });
});

router.post("/create-customer", async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
  });

  //   store customer id in database

  res.status(200).json({ customer: customer });
});

router.post("/create-subscription", async (req, res) => {
  const { customerId, priceId } = req.body;

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/invoice-preview", async (req, res) => {
  //   get customer Id from req.query or req.params

  const priceId = process.env[req.query.newPriceLookupKey.toUpperCase()];

  const subscription = await stripe.subscriptions.retrieve(
    req.query.subscriptionId
  );

  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId,
    subscription: req.query.subscriptionId,
    subscription_items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
  });

  res.json({ invoice });
});

router.post("/cancel-subscription", async (req, res) => {
  // Cancel the subscription
  try {
    const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
    );

    res.json({ subscription: deletedSubscription });
  } catch (error) {
    return res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/update-subscription", async (req, res) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(
      req.body.subscriptionId
    );
    const updatedSubscription = await stripe.subscriptions.update(
      req.body.subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: process.env[req.body.newPriceLookupKey.toUpperCase()],
          },
        ],
      }
    );

    res.json({ subscription: updatedSubscription });
  } catch (error) {
    return res.status(400).json({ error: { message: error.message } });
  }
});

router.get("/subscriptions", async (req, res) => {
  //  get customer id from req.params

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    expand: ["data.default_payment_method"],
  });

  res.json({ subscriptions });
});

module.exports = router;
