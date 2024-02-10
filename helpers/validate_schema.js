const Joi = require("@hapi/joi");

const authSchema = Joi.object({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(3).required(),
  roles: Joi.string().default("user"),
});

module.exports = { authSchema };
