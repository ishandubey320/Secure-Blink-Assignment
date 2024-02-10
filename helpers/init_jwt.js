const JWT = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signWithAccess: (email) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1h",
        issuer: "ishan",
        audience: email,
      };

      JWT.sign(payload, secret, options, (error, token) => {
        if (error) return reject(error);
        resolve(token);
      });
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());

    const bearerToken = req.headers["authorization"].split(" ");
    const token = bearerToken[1];

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        const message =
          error.name === "JsonWebTokenError" ? "Unauthorized" : error.message;
        return next(createError.Unauthorized(message));
      }

      req.payload = payload;
      return next();
    });
  },
};
