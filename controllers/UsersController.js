import UserModel from "../models/UsersModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/CreateToken.js";
import mongoose from "mongoose";
import ProductModel from "../models/ProductsModel.js";
export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    if (!email) {
      throw new Error("email is require");
    }
    if (!username) {
      throw new Error("username is require");
    }
    if (!password) {
      throw new Error("password is require");
    }
    if (password !== passwordConfirm) {
      throw new Error("password and password confirm are not equal");
    }
    const exist = await UserModel.findOne({ email });
    if (exist) {
      throw new Error("this email is already used.");
      // res.json({ error: "this email is already used." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const user = await new UserModel({ username, email, password: hashPass });
    await user.save();
    const token = await generateToken(res, user._id);
    if (user)
      return res
        .status(201)
        .json({ Message: "Done Create User.", user, token });
  } catch (error) {
    console.error(`Error Contoller Create User: ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const LoggIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exist = await UserModel.findOne({ email });
    if (!exist) {
      throw new Error("there is no user found have this email");
    }
    const comparePass = await bcrypt.compare(password, exist.password);
    if (!comparePass) {
      throw new Error("wrong password");
    }
    const token = await generateToken(res, exist._id);
    return res.status(200).json({ exist, token });
  } catch (error) {
    console.error(`Error Controller Loggin: ${error.message}`);
    res.status(400).json(error.message);
    // throw new Error(`${error.message}`);
  }
};

export const loggOut = async (req, res, next) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });
  return res.status(200).json({ Message: "Done Loggout Successfully." });
};

export const getAllUsers = async (req, res, next) => {
  // try {
  const allUsers = await UserModel.find();
  if (!allUsers) {
    throw new Error("Something went wrong..");
  }
  return res.status(200).json({ allUsers });
  // } catch (error) {
  // console.error(`Error Controller Get Users: ${error.message}`);
  // }
};

export const getProfile = async (req, res, next) => {
  try {
    const id = req.user._id;
    if (!id) {
      throw new Error("no id like that");
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("no user founded");
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(`Error Get Profile Conroller: ${error.message}`);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const id = req.user._id;
    if (!id) {
      throw new Error("no id like that");
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("no user founded");
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password =
        (await bcrypt.hash(req.body.password, salt)) || user.password;
    }
    await user.save();
    return res.status(201).json({ Message: "Done Update Profile", user });
  } catch (error) {
    console.error(`Error Update Profile Conroller: ${error.message}`);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(400).send("no user found");
      throw new Error("no user Found");
    }
    if (user.isAdmin) {
      res.status(400).send("cant remove admin");
      throw new Error("cant remove admin");
    }
    await UserModel.deleteOne(new mongoose.Types.ObjectId(id));
    return res.status(200).json({ Message: "Done Remove User Successfully.." });
  } catch (error) {
    console.error(`Error Delete User Controller: ${error.message}`);
  }
};

export const getUpdateUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send("cant find user");
      throw new Error("cant find user");
    }
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(400).send("cant find user");
      throw new Error("cant find user");
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    if (req.body.password) {
      res.status(400).send("cant update user password.");
      throw new Error("cant update user password.");
    }
    await user.save();
    return res
      .status(201)
      .json({ Message: `Done Update ${user.username} profile`, user });
  } catch (error) {
    console.error(`Error Update Spacefic User Controller: ${error.message}`);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("cant find user");
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("cant find user");
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(`Error Get Spacefic User Controller: ${error.message}`);
  }
};

export const addPordToCart = async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    throw new Error("Cant find User.");
  }
  const product = await ProductModel.findById(req.params.prodId);
  if (!product) {
    throw new Error("No Product Founded");
  }
  await user.addToCart(product);
  console.log(user, "cart");

  return res
    .status(201)
    .json({ message: `Done Add ${product.name} in your cart`, user });
  try {
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const removeProdToCart = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      throw new Error("Cant find User.");
    }
    const product = await ProductModel.findById(req.params.prodId);
    if (!product) {
      throw new Error("No Product Founded");
    }
    await user.removeFromCart(product._id);
    console.log(user, "cart");

    return res
      .status(201)
      .json({ message: `Done Delete ${product.name} From your cart`, user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const addShippingAddress = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) throw new Error("No User Founded");
    const { address, city, postalCode, country } = req.body;
    const shippingAddress = { address, city, postalCode, country };
    await user.AddShippingAddress(shippingAddress);
    return res.status(201).json({ message: "Done Add Shipping Address", user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      throw new Error("Cant find User.");
    }

    await user.clearCart();
    console.log(user, "cart");

    return res.status(201).json({ message: `Done Checkout`, user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};
