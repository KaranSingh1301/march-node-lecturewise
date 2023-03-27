const express = require("express");
const User = require("../Schemas/User");
const { cleanUpAndValidate } = require("../utils/AuthUtils");
const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, username, email, password } = req.body;

  await cleanUpAndValidate({ name, email, password, username })
    .then(async () => {
      const user = new User({
        name: name,
        email: email,
        password: password,
        username: username,
      });

      try {
        const userDb = await user.save();
        console.log(userDb);

        return res.send({
          status: 201,
          message: "User created successfully",
          data: userDb,
        });
      } catch (error) {
        return res.send({
          status: 500,
          message: "Database error",
          error: error,
        });
      }
    })
    .catch((err) => {
      return res.send({
        status: 400,
        message: "Data Invalid",
        error: err,
      });
    });
});

AuthRouter.post("/login", (req, res) => {
  return res.send(true);
});

module.exports = AuthRouter;
