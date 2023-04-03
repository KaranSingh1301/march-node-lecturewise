const validator = require("validator");

const cleanUpAndValidate = ({ name, email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !password || !name || !username) {
      reject("Missing credentials");
    }

    if (typeof email !== "string") {
      reject("Invalid Email");
    }
    if (typeof username !== "string") {
      reject("Invalid Username");
    }
    if (typeof password !== "string") {
      reject("Invalid password");
    }

    if (username.length <= 2 || username.length > 50)
      reject("Username length should be 3-50");

    if (password.length <= 2 || password.length > 25)
      reject("Password length should be 3-25");

    if (!validator.isEmail(email)) {
      reject("Invalid Email format");
    }
    resolve();
  });
};

module.exports = { cleanUpAndValidate };
