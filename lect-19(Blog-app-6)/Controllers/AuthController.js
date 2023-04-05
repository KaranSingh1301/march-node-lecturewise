const express = require("express");
const { cleanUpAndValidate } = require("../utils/AuthUtils");
const AuthRouter = express.Router();
const User = require("../Models/UserModel");
const { isAuth } = require("../Middlewares/AuthMiddleware");

AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, username, email, password } = req.body;

  await cleanUpAndValidate({ name, email, password, username })
    .then(async () => {
      try {
        await User.verifyUsernameAndEmailExits({ email, username });
      } catch (error) {
        return res.send({
          status: 400,
          message: "Error Occurred",
          error: error,
        });
      }

      //create an obj for user class
      const userObj = new User({
        name,
        email,
        password,
        username,
      });

      try {
        const userDb = await userObj.registerUser();

        return res.send({
          status: 200,
          message: "User Created Successfully",
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

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing Credentials",
    });

  try {
    const userDb = await User.loginUser({ loginId, password });

    //session bases authentication
    req.session.isAuth = true;
    req.session.user = {
      username: userDb.username,
      email: userDb.email,
      userId: userDb._id,
    };

    return res.send({
      status: 200,
      message: "Login Successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Error Occured",
      error: error,
    });
  }
});

AuthRouter.post("/logout", isAuth, (req, res) => {
  const user = req.session.user;

  req.session.destroy((err) => {
    if (err) {
      return res.send({
        status: 400,
        message: "Logout unsuccessfull",
        error: err,
      });
    }

    return res.send({
      status: 200,
      message: "Logout Sucessfully",
      data: user,
    });
  });
});

module.exports = AuthRouter;
