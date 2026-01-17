import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import {
  initializePayment,
  verifyTransaction,
} from "../services/paychanguService.js";

// @desc    Create new order & initialize payment
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { orderItems, totalAmount, deliveryNotes } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ success: false, message: "No order items" });
  }

  try {
    const tx_ref = `LXA-${Date.now()}`;

    const order = new Order({
      user: req.user._id,
      products: orderItems.map((item) => ({
        product: item._id,
        quantity: item.qty,
        price: item.price,
      })),
      totalAmount,
      transactionRef: tx_ref,
      deliveryDetails: { notes: deliveryNotes },
    });

    const createdOrder = await order.save();

    // Initialize PayChangu Payment
    const paymentData = {
      amount: totalAmount,
      email: req.user.email,
      first_name: req.user.name.split(" ")[0],
      last_name: req.user.name.split(" ")[1] || "Customer",
      tx_ref: tx_ref,
      callback_url: `${process.env.FRONTEND_URL}/order-success/${createdOrder._id}`,
      return_url: `${process.env.FRONTEND_URL}/order-success/${createdOrder._id}`,
      customization: {
        title: "Loita Avon Shop",
        description: `Payment for Order #${createdOrder._id}`,
      },
    };

    const paymentResponse = await initializePayment(paymentData);

    res.status(201).json({
      success: true,
      order: createdOrder,
      payment_url:
        paymentResponse.data?.checkout_url || paymentResponse.checkout_url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify payment and update order status
// @route   GET /api/orders/:id/verify
// @access  Private
const verifyOrderPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const verification = await verifyTransaction(order.transactionRef);

    if (
      verification.status === "success" ||
      verification.data?.status === "success"
    ) {
      order.paymentStatus = "paid";
      await order.save();
      res.json({
        success: true,
        message: "Payment verified successfully",
        order,
      });
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "Payment verification failed or pending",
        });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort("-createdAt");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = "delivered";
      const updatedOrder = await order.save();
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createOrder,
  verifyOrderPayment,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
