import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    const extfile = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpe?g|png|webp/;
  const mimeTypes = /image\/jpe?g|image\/png\/image\/webp/;

  const fileType = path.extname(file.originalname).toLocaleLowerCase();
  const mimeType = file.mimetype;

  if (fileTypes.test(fileType) && mimeTypes.test(mimeType)) {
    cb(null, true);
  } else {
    cb(new Error("Image only"), false);
  }
};

const uploadImages = multer({ storage, fileFilter });
const upload = uploadImages.single("image");

router.post("/upload-image", (req, res, next) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        throw new Error(`${err.message}`);
      }
      if (req.file) {
        res.status(201).json({
          message: "Done Upload Image Successfully.",
          image: `/${req.file.path}`,
        });
      }
    });
  } catch (error) {
    console.error(`Error Upload Image: ${error.message}`);
    res.status(400).json(error.message);
  }
});

export default router;
