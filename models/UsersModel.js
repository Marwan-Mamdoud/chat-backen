import mongoose from "mongoose";

const Users = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    cart: {
      items: [
        {
          product: {
            type: Object,
            ref: "Product",
          },
          quantity: { type: Number },
        },
      ],
      itemsPrice: { type: Number, required: true },
      paymentMethod: { type: String, default: "PayPal" },
      taxPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      shippingAddress: {
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String },
      },
      shippingPrice: { type: Number },
    },
  },
  { timestamps: true }
);

Users.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    console.log();
    return cp.product._id.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      product: product,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  this.cart.itemsPrice = this.cart.items.reduce(
    (acc, item) => item.product.price * item.quantity + acc,
    0
  );
  this.cart.taxPrice = 0.15 * this.cart.itemsPrice;
  this.cart.shippingPrice = this.cart.itemsPrice < 1000 ? 50 : 0;
  this.cart.totalPrice =
    this.cart.itemsPrice + this.cart.taxPrice + this.cart.shippingPrice;
  return this.save();
};

Users.methods.AddShippingAddress = function (shippingAddress) {
  this.cart.shippingAddress = shippingAddress;
  return this.save();
};

Users.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.product._id.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  this.cart.itemsPrice = this.cart.items.reduce(
    (acc, item) => item.product.price * item.quantity + acc,
    0
  );
  this.cart.taxPrice = 0.15 * this.cart.itemsPrice;
  this.cart.shippingPrice = this.cart.itemsPrice < 1000 ? 50 : 0;
  this.cart.totalPrice =
    this.cart.itemsPrice + this.cart.taxPrice + this.cart.shippingPrice;
  return this.save();
};

Users.methods.clearCart = function () {
  this.cart = {
    items: [],
    shippingPrice: 0,
    shippingAddress: {},
    totalPrice: 0,
    taxPrice: 0,
    paymentMethod: "",
    itemsPrice: 0,
  };
  return this.save();
};

const users = mongoose.model("Users", Users);
export default users;
