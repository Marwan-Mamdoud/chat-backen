import { isValidObjectId } from "mongoose";

export default async function CheckId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invlid ID");
  }
  next();
}
