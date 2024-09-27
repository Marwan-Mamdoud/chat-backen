import jwt from "jsonwebtoken";

export const generateToken = async (res, userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("jwt", token, {
      // httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
  } catch (error) {
    console.error(`Error Token: ${error.message}`);
  }
};
