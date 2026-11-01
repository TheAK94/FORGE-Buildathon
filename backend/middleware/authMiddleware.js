
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please log in."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User account no longer exists."
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired session. Please log in again."
    });
  }
};

module.exports = protect;
