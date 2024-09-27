import CategoriesModel from "../models/CategoriesModel.js";

export const createCategories = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      throw new Error("Name is required.");
    }
    const exist = await CategoriesModel.findOne({ name });
    if (exist) {
      throw new Error("This Categories Already Exitst.");
    }
    const category = await new CategoriesModel({ name });
    await category.save();
    return res
      .status(201)
      .json({ Message: "Done Create New Category", category });
  } catch (error) {
    console.error(`Error Controller Create Categories: ${error.message}`);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoriesModel.find();
    if (!categories) {
      throw new Error("Something went wrong");
    }
    return res.status(200).json({ categories });
  } catch (error) {
    console.error(`Error Controller Get All Categories: ${error.message}`);
    return res.status(400).json(error.message);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("cant find category");
    }
    const data = await CategoriesModel.findByIdAndDelete(id);
    if (!data) {
      throw new Error("Something went wrong");
    }
    return res
      .status(201)
      .json({ Message: "Done Delete Category Successfully.." });
  } catch (error) {
    console.error(`Error Controller Delete Category: ${error.message}`);
  }
};

export const updataCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    if (!id) {
      throw new Error("cant find category");
    }
    const data = await CategoriesModel.findById(id);
    if (!data) {
      throw new Error("Something went wrong");
    }
    data.name = name;
    await data.save();
    return res
      .status(201)
      .json({ Message: "Done Update Category Successfully..", data });
  } catch (error) {
    console.error(`Error Controller Delete Category: ${error.message}`);
  }
};
