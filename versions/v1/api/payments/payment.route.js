const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51Kx74vSCQeBePjOS7haTk4zAyDERCpSrtYd5fofPn2UkverTapiTgjxjFvaXgxvP0TKAgYAhXJdthQaJwWkQHmkQ00WdMCmj31"
);
const uuid = require("uuid").v4;
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");

router.post("/checkout", async (req, res, next) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { subscription } = req.body;

    // const customer = await stripe.customers.create({
    //   email: token.email,
    //   source: token.id,
    // });
    // console.log(customer);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: subscription.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
    // const price = await stripe.prices.create({
    //   currency: "usd",
    //   unit_amount: 120000,
    //   product_data: { name: "stand up paddleboard" },
    // });
    // const charge = await stripe.charges.create(
    //   {
    //     amount: subscription.amount * 100,
    //     currency: "usd",
    //     customer: customer.id,
    //     receipt_email: token.email,
    //     description: `Purchased the ${subscription.name}`,
    //     shipping: {
    //       name: token.name,
    //       address: {
    //         line1: token.address_line1,
    //         line2: token.address_line2,
    //         city: token.address_city,
    //         country: token.address_country,
    //         postal_code: token.address_zip,
    //       },
    //     },
    //   },
    //   {
    //     idempotency_key,
    //   }
    // );
    // console.log("Charge:", { price });
    // status = "success";
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }

  //   res.json({ error, status });
});
module.exports = router;
