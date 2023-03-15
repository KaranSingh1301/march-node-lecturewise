const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//file-imports
const { cleanUpAndValidate } = require("./utils/AuthUtils");
const userSchema = require("./userSchema");

//variables
const app = express();
const PORT = process.env.PORT || 8000;
const saltRound = 11;
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/march-todo-app`;

app.set("view engine", "ejs");

//db Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(clc.green.bold.underline("MongoDb connected"));
  })
  .catch((err) => {
    console.log(clc.red.bold(err));
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  return res.send("This is your Todo App");
});

app.get("/register", (req, res) => {
  return res.render("register");
});

app.get("/login", (req, res) => {
  return res.render("login");
});

//MVC

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password, username } = req.body;

  //data validation
  try {
    await cleanUpAndValidate({ name, email, password, username });

    //check if the user exits

    const userExistEmail = await userSchema.findOne({ email });

    console.log(userExistEmail);
    if (userExistEmail) {
      return res.send({
        status: 400,
        message: "Email Already exits",
      });
    }

    const userExistUsername = await userSchema.findOne({ username });

    if (userExistUsername) {
      return res.send({
        status: 400,
        message: "Username Already exits",
      });
    }

    //hash the password using bcypt
    const hashPassword = await bcrypt.hash(password, saltRound);

    const user = new userSchema({
      name: name,
      email: email,
      password: hashPassword,
      username: username,
    });

    try {
      const userDb = await user.save();
      console.log(userDb);
      return res.send({
        status: 201,
        message: "User register successfully",
        data: userDb,
      });
    } catch (error) {
      return res.send({
        status: 500,
        message: "Database error",
        error: error,
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Data Invalid",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(clc.yellow.bold(`Server is running`));
  console.log(clc.yellow.bold.underline(`http://localhost:${PORT}`));
});

//create server and mongodb-connection
//Registeration Page
//register.ejs
//register a user in DB

//Login Page
//Dashbaord
