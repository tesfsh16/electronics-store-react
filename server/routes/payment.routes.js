const express = require("express");
const https = require("https");
const Order = require("../models/Order");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST /api/payments/chapa/initialize
// Start a Chapa payment for an order
// Flow: frontend calls this → we call Chapa → Chapa returns a checkout URL → user pays on Chapa
router.post("/chapa/initialize", protect, async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Make sure this user owns the order
  if (order.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Create a unique transaction reference (tx_ref)
  const txRef = `estore-${order._id}-${Date.now()}`;

  const chapaPayload = JSON.stringify({
    amount: order.totalPrice.toString(),
    currency: "ETB",
    email: req.user.email,
    first_name: req.user.name.split(" ")[0],
    last_name: req.user.name.split(" ").slice(1).join(" ") || "Customer",
    tx_ref: txRef,
    callback_url: `${process.env.SERVER_URL || "http://localhost:5000"}/api/payments/chapa/callback`,
    return_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/order/${order._id}?payment=success`,
    customization: {
      title: "Electronics Store",
      description: `Order #${order._id}`,
    },
  });

  // Call Chapa API to start the payment
  const options = {
    hostname: "api.chapa.co",
    path: "/v1/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(chapaPayload),
    },
  };

  const chapaRequest = https.request(options, (chapaResponse) => {
    let data = "";
    chapaResponse.on("data", (chunk) => (data += chunk));
    chapaResponse.on("end", async () => {
      const chapaData = JSON.parse(data);

      if (chapaData.status === "success") {
        // Save the tx_ref so we can verify payment later
        order.chapaTxRef = txRef;
        await order.save();

        res.json({
          checkoutUrl: chapaData.data.checkout_url,
          txRef,
        });
      } else {
        res
          .status(400)
          .json({ message: "Chapa initialization failed", details: chapaData });
      }
    });
  });

  chapaRequest.on("error", (error) => {
    res.status(500).json({ message: "Payment service error", error: error.message });
  });

  chapaRequest.write(chapaPayload);
  chapaRequest.end();
});

// GET /api/payments/chapa/callback
// Chapa calls this URL after payment (server to server)
router.get("/chapa/callback", async (req, res) => {
  const { trx_ref } = req.query;

  if (!trx_ref) {
    return res.status(400).json({ message: "No transaction reference" });
  }

  // Verify the payment with Chapa
  const options = {
    hostname: "api.chapa.co",
    path: `/v1/transaction/verify/${trx_ref}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  };

  const verifyRequest = https.request(options, (verifyResponse) => {
    let data = "";
    verifyResponse.on("data", (chunk) => (data += chunk));
    verifyResponse.on("end", async () => {
      const verifyData = JSON.parse(data);

      if (verifyData.status === "success") {
        // Update the order to paid
        await Order.findOneAndUpdate(
          { chapaTxRef: trx_ref },
          { paymentStatus: "paid", status: "processing" }
        );
        res.json({ message: "Payment verified" });
      } else {
        await Order.findOneAndUpdate(
          { chapaTxRef: trx_ref },
          { paymentStatus: "failed" }
        );
        res.json({ message: "Payment failed or not completed" });
      }
    });
  });

  verifyRequest.on("error", (error) => {
    res.status(500).json({ message: "Verification error", error: error.message });
  });

  verifyRequest.end();
});

module.exports = router;
