import OrdersModel from "../models/OrdersModel.js";
import ProductsModel from "../models/ProductsModel.js";

// utitlity Functions..
const calculatePrices = (orderItems) => {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = (itemsPrice * 0.15).toFixed(2);
  const totalPrice = (
    itemsPrice +
    parseFloat(taxPrice) +
    shippingPrice
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
};

export const createOrder = async (req, res, next) => {
  try {
    console.log(req.body);

    const { orderItems, shippingAddress, paymentMethod } = req.body;
    if (!orderItems || orderItems.length < 1) {
      throw new Error("No Product Found");
    }
    const itemsFromDB = await ProductsModel.find({
      _id: { $in: orderItems.map((item) => item.product) },
    });
    console.log(itemsFromDB, "item form db");

    const dbOrderItems = await orderItems.map((item) => {
      const matchingItem = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === item.product.toString()
      );
      if (!matchingItem) {
        throw new Error(`No Find ${itemFromDB.name} In DB`);
      }
      return {
        ...item,
        product: item.product,
        price: matchingItem.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calculatePrices(dbOrderItems);

    const order = await new OrdersModel({
      user: req.user._id,
      orderItems: dbOrderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
      itemsPrice,
      totalPrice,
    });

    const orderCreated = await order.save();

    return res.status(201).json({
      message: "Done Create Order Successfully.",
      order: orderCreated,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrdersModel.find().populate("user", "username email");
    const count = await OrdersModel.countDocuments();
    const seles = orders
      .reduce((acc, item) => item.totalPrice + acc, 0)
      .toFixed(2);
    if (!orders) {
      throw new Error("No Orders Founded");
    }
    return res
      .status(200)
      .json({ message: "Done Get All Order", count, seles, orders });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await OrdersModel.find({ user: req.user._id }).populate(
      "user"
    );
    if (!orders) throw new Error("No Orders Founded");
    return res
      .status(200)
      .json({ Message: `Done Get ${req.user.username} Orders`, orders });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const calculateSalesByDate = async (req, res, next) => {
  try {
    const SalesByDate = await OrdersModel.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    return res.status(200).json({ message: "Done Get It", SalesByDate });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await OrdersModel.findById(req.params.id).populate(
      "user",
      "username email"
    );
    if (!order) throw new Error("No Order With That Id");
    return res.status(200).json({ message: "Done Get Order", order });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const markOrderAsPaid = async (req, res, next) => {
  try {
    const order = await OrdersModel.findById(req.params.id);
    if (!order) throw new Error("No Order Founded");
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const Order = await order.save();
    return res
      .status(201)
      .json({ message: "Done Mark Order As Paid", order: Order });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const markOrderAsDeliverd = async (req, res, next) => {
  try {
    const order = await OrdersModel.findById(req.params.id);
    if (!order) throw new Error("No Order Founded");
    order.deliveredAt = Date.now();
    order.isDelivered = true;
    const Order = await order.save();
    return res
      .status(201)
      .json({ message: "Done Mark Order As Deliverd", order: Order });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};
