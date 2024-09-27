import jwt from "jsonwebtoken";
import UserModel from "../models/UsersModel.js";

export const authenticate = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      throw new Error("no token..");
    }
    const token = req.cookies.jwt;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("not authenticate");
    }
    req.user = await UserModel.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    console.error(`Error Middleware Authenticate: ${error.message}`);
    res.status(400).send("You are not authenticate..");
  }
};

export const authorized = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("You are not authentice");
    }
    const { user } = req;
    if (!user.isAdmin) {
      throw new Error("you Are not admin...");
    }
    next();
  } catch (error) {
    console.error(`Error Middleware Autherized: ${error.message}`);
    res.status(400).send("You are not admin......");
  }
};
