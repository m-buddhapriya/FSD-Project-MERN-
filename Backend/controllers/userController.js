const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (!name || !phone || !email || !password || !role) {
      return next(createHttpError(400, "All fields are required!"));
    }

    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
      return next(createHttpError(400, "User already exists!"));
    }

    //const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, phone, email, password, role });
    await newUser.save();

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({
      success: true,
      message: "New user created!",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(createHttpError(400, "All fields are required!"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(401, "Invalid credentials USER"));
    }
    
    console.log(user.password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    console.log(password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(401, "Invalid credentials PASS"));
    }

    const token = jwt.sign({ id: user._id }, config.accessTokenSecret, { expiresIn: "1d" });

    const userResponse = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      token,
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const getUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getUserData, logout };
