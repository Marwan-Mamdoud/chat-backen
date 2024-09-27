import ProductModel from "../models/ProductsModel.js";
import ObjectId from "mongoose";
export const createProduct = async (req, res, next) => {
  const {
    name,
    description,
    quantity,
    brand,
    price,
    category,
    image,
    countInStock,
  } = req.fields;
  try {
    switch (true) {
      case !name:
        throw new Error("name is required");
      case !description:
        throw new Error("description is required");
      case !quantity:
        throw new Error("quatity is required");
      case !brand:
        throw new Error("brand is required");
      case !price:
        throw new Error("price is reqiured");
      case !category:
        throw new Error("catergory is required");
      case !image:
        throw new Error("image is required");
      case !countInStock:
        throw new Error("stock is required");
    }
    const product = await ProductModel({ ...req.fields });
    await product.save();
    return res.status(201).json({
      message: `Done Create ${product.name} Product Successfully..`,
      product,
    });
  } catch (error) {
    console.error(`Error Create Product: ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find().populate("category");
    if (!products) {
      throw new Error("no products");
    }
    return res
      .status(200)
      .json({ Message: "Done Get Products Successfully..", products });
  } catch (error) {
    console.error(`Error Get All Product: ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      throw new Error("no product found");
    }
    product.name = req.fields.name || product.name;
    product.description = req.fields.description || product.description;
    product.brand = req.fields.brand || product.brand;
    product.quantity = req.fields.quantity || product.quantity;
    product.rating = req.fields.rating || product.rating;
    product.image = req.fields.image || product.image;
    product.price = req.fields.price || product.price;
    product.category = req.fields.category || product.category;
    product.reviews = req.fields.reviews || product.reviews;
    product.countInStock = req.fields.countInStock || product.countInStock;
    product.numReviews = req.fields.numReviews || product.numReviews;

    await product.save();
    return res
      .status(201)
      .json({ Message: "Done Update Product Successfully..", product });
  } catch (error) {
    console.error(`Error Update Product: ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new Error("cant find product");
    }
    return res
      .status(200)
      .json({ Message: "Done Delete Product Successfully.." });
  } catch (error) {
    console.log(`Error Delete Product: ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      throw new Error("cant find product");
    }
    return res
      .status(200)
      .json({ Message: "Done Get Product Successfully..", product });
  } catch (error) {
    console.log(`Error Delete Product: ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const getBestProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find().sort({ rating: -1 }).limit(4);
    const length = products.length;
    if (!products) {
      throw new Error("Something went wrong");
    }
    return res
      .status(200)
      .json({ Messge: "Done Get Best Products ", length, products });
  } catch (error) {
    console.log(`Error Get Best Products ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const getNewestProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find().sort({ _id: -1 });
    if (!products) {
      throw new Error("Something went wrong");
    }
    return res
      .status(200)
      .json({ Messge: "Done Get Newest Products ", products });
  } catch (error) {
    console.log(`Error Get Newest Products ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const filterProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, brand } = req.body;
    const arg = {};
    if (category) {
      arg.category = category;
    }
    if (minPrice && !maxPrice) {
      arg.price = { $gt: minPrice };
    }
    if (maxPrice && !minPrice) {
      arg.price = { $lt: maxPrice };
    }
    if (maxPrice && minPrice) {
      arg.price = { $gt: minPrice, $lt: maxPrice };
    }
    if (brand) {
      arg.brand = brand;
    }
    const products = await ProductModel.find(arg);
    if (!products || products.length < 1) {
      throw new Error("no Products Found");
    }
    return res.status(200).json({
      message: "Done Filterd Product",
      products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

//????????????????????????????????????????????????????????????????????????????

export const fetchCustomProduct = async (req, res, next) => {
  try {
    const pageLimit = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const count = await ProductModel.countDocuments({ ...keyword });
    const products = await ProductModel.find({ ...keyword }).limit(pageLimit);
    if (!products) {
      throw new Error("Cant find Products");
    }
    return res.status(200).json({
      products: products,
      page: 1,
      pages: Math.ceil(count / pageLimit),
      hasMore: false,
    });
  } catch (error) {
    console.log(`Error Fetch Custom Products: ${error.message}`);
    res.status(400).json(error.message);
  }
};

//????????????????????????????????????????????????????????????????????????????

export const addReview = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    console.log(product);

    if (!product) {
      throw new Error("No Product Founded");
    }
    const alreadyReviewed = await product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      throw new Error("This User Already Reviewed in this Product");
    }
    const { rating, comment } = req.body;
    if (!rating) {
      throw new Error("Reting is required");
    }
    if (!comment) {
      throw new Error("Comment is required");
    }
    const review = {
      name: req.user.username,
      rating,
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((item, acc) => acc.rating + item, 0) /
      product.reviews.length;
    return await product.save();
    res.status(201).json({
      message: `Done Add Review To ${product.name} Product.`,
      product,
    });
  } catch (error) {
    console.log(`Error Add Review: ${error.message}`);
    res.status(400).json(error.message);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      throw new Error("No Product Founded");
    }
    const reviews = product.reviews;
    return res.status(200).json({
      Message: `Done Get All Review For ${product.name} Product`,
      reviews,
    });
  } catch (error) {
    console.log(`Error Get All Reviews: ${error.message}`);
    res.status(400).json(error.message);
  }
};

// export const getAllReviewsForUser = async (req, res, next) => {
//   try {
//     const ProductsYouReview = await ProductModel.find();
//     if (!ProductsYouReview) {
//       throw new Error("Cant find Proudcts You Reviewed");
//     }
//     const Reviews = ProductsYouReview.map((prod) => prod.reviews);
//     // const reviews = Reviews.find(
//     //   (rev) => rev.user.id.toString() === req.user._id.toString()
//     // );
//     const reviews = Reviews.find((rev) =>
//       rev.find((re) => re.user.id.toString() === req.user._id.toString())
//     );

//     res.status(200).json({
//       Message: `Done Get All Reviews That ${req.user.username} reviewed`,
//       reviews,
//     });
//   } catch (error) {
//     console.error(`Error Get All Review For Spacifec User`);
//     res.status(400).json(error.message);
//   }
// };
