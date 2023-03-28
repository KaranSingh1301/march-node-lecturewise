const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");

let User = class {
  username;
  name;
  email;
  password;

  constructor({ username, email, password, name }) {
    this.username = username;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );

      const user = new UserSchema({
        username: this.username,
        name: this.name,
        email: this.email,
        password: hashedPassword,
      });

      try {
        const userDb = await user.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyUsernameAndEmailExits({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email }, { username }],
        });

        if (userDb && userDb.email === email) {
          reject("Email Already Exit");
        }

        if (userDb && userDb.username === username) {
          reject("Username Already Exit");
        }

        return resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static loginUser({ loginId, password }) {
    return new Promise(async (resolve, reject) => {
      //find the user with loginId
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (!userDb) {
          return reject("User does not exit");
        }

        //match the password
        const isMatch = await bcrypt.compare(password, userDb.password);

        if (!isMatch) {
          reject("Password Does not matched");
        }

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;

//server--->controller--->model---->Schema---->mongoose
