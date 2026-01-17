import crypto from "crypto";
import Order from "../models/orderModel.js";

/**
 * Handle PayChangu Webhook
 * @route POST /api/payments/webhook
 */
const paychanguWebhook = async (req, res) => {
  const signature = req.headers["x-paychangu-signature"]; // Verify actual header name in docs if possible, usually it's X-PayChangu-Signature
  const secret = process.env.PAYCHANGU_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return res.status(400).send("Webhook signature or secret missing");
  }

  // Verify signature
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== signature) {
    return res.status(401).send("Invalid signature");
  }

  const { status, tx_ref, event } = req.body;

  // We only care about successful payment events
  if (event === "payment.success" || status === "success") {
    try {
      const order = await Order.findOne({ transactionRef: tx_ref });
      if (order) {
        order.paymentStatus = "paid";
        await order.save();
        console.log(`Order ${order._id} marked as PAID via webhook`);
      }
    } catch (error) {
      console.error("Webhook Error updating order:", error);
      return res.status(500).send("Error updating order");
    }
  }

  res.status(200).send("Webhook received");
};

export { paychanguWebhook };
