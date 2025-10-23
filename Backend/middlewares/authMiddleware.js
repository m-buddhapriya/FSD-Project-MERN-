// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const config = require("../config/config");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(createHttpError(401, "Authorization header missing"));

    const token = authHeader.split(" ")[1]; // Bearer tokenString
    if (!token) return next(createHttpError(401, "Token missing"));

    jwt.verify(token, config.accessTokenSecret, (err, decoded) => {
      if (err) return next(createHttpError(401, "Invalid token"));
      req.user = { id: decoded.id };
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
