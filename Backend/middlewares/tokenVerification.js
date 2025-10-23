const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");

const isVerifiedUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createHttpError(401, "No token provided"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.accessTokenSecret);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(createHttpError(401, "User not found"));

    req.user = user;
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

module.exports = { isVerifiedUser };
