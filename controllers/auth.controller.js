const createError = require("http-errors");
const JWT = require("jsonwebtoken");
const { authSchema } = require("../helpers/validate_schema");
const { signWithAccess } = require("../helpers/init_jwt");
const { findUserByEmail, addUser } = require("../models/user.model");
const ElasticEmail = require("@elasticemail/elasticemail-client");
const defaultClient = ElasticEmail.ApiClient.instance;
const apikey = defaultClient.authentications["apikey"];
apikey.apiKey =
  "C9F47385FCB3647A58956C6C7B4561EBD6EB1F45E1D0AD4FFE749839F7B095B364E4E0ABE4309BE0861233B5ABA41CE6";

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const doesUserExist = await findUserByEmail(result.email);

      if (doesUserExist)
        throw createError.Conflict(`${result.email} is already registered`);

      const user = await addUser(result.email, result.password, result.roles);
      res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      console.log(result);
      const user = await findUserByEmail(result.email);
      if (!user) {
        throw createError.NotFound("user does not exist");
      }
      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) throw createError.Unauthorized("Bad Credentials");
      const accessToken = await signWithAccess(user.email);
      res.send({ accessToken: accessToken });
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/password"));
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await findUserByEmail(email);
      if (!user) throw createError.NotFound("User with mail is not registered");

      const api = new ElasticEmail.EmailsApi();
      const token = await signWithAccess(email);
      const resetLink = `http://localhost:${
        process.env.PORT || 3000
      }/auth/reset-password/${token}`;
      const mailData = {
        Recipients: {
          To: [email],
        },
        Content: {
          Body: [
            {
              ContentType: "HTML",
              Charset: "utf-8",
              Content: `<html>
                  <body>
                    <p>Dear User,</p>
                    <p>
                      Your Password reset link:
                      <a href="${resetLink}" Authorization="Bearer ${token}">${resetLink}</a><br>
                    </p>
                    <p>The password reset link is only active for one hour.</p>
                    <p>Thanks</p>
                    <p>@Secure Blink Team</p>
                  </body>
                </html>`,
            },
          ],
          From: "ishandubeycoding@gmail.com",
          Subject: "Example email",
        },
      };

      api.emailsTransactionalPost(mailData, (error, data, response) => {
        if (error) {
          console.error("Error:", error.response.body);
        } else {
          console.log("Email sent successfully.");
          res.send("Please check the mail.\n The password reset link is sent");
        }
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { password } = req.body;
      const email = req.payload.aud;
      const user = await findUserByEmail(email);
      user.password = password;
      await user.hashPassword();
      res.send("password changed successfully.");
    } catch (error) {
      next(error);
    }
  },
};
