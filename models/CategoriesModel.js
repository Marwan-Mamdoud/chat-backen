import mongoose from "mongoose";

const CategoriesModel = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
});

const model = mongoose.model("Categories", CategoriesModel);
export default model;
