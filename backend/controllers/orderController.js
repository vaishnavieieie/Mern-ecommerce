import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Razorpay from "razorpay";

//@desc Create new order
//@route POST /api/orders
//@acc Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }
});

//@desc Get order by ID
//@route GET /api/orders/:id
//@acc Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: "user",
    model: "User",
    select: "name email",
  });
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc Update order to paid
//@route GET /api/orders/:id/pay
//@acc Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // order.paymentResult = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   update_time: req.body.update_time,
    //   email_address: req.body.payer.email_address,
    // };
    order.razorpay = {
      orderId: req.body.order_Id,
      paymentId: req.body.payment_Id,
      signature: req.body.signature,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//create order razorpay
export const createOrder = asyncHandler(async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount,
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    if (!order) {
      res.status(500);
      throw new Error("Something went wrong:(");
      return;
    } else {
      res.send(order);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

//update order to paid
export const payOrder = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();

      order.razorpay = {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
};

//@desc Get user orders
//@route GET /api/orders/myorders
//@acc Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
};

//@desc Get user orders
//@route GET /api/orders
//@acc Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

//@desc Update order to delivered
//@route GET /api/orders/:id/deliver
//@acc Private
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
