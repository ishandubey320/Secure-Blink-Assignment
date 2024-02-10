const { findUserByEmail } = require("../models/user.model");
async function isAdmin(req, res, next) {
  try {
    const email = req.payload.aud;
    const user = await findUserByEmail(email);
    if (user && user.roles.includes("admin")) {
      next();
    } else
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
  } catch (error) {
    next(error);
  }
}

module.exports = { isAdmin };
