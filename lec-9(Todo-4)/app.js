const express = require("express");
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file-imports
const { cleanUpAndValidate } = require("./utils/AuthUtils");
const userSchema = require("./userSchema");
const { isAuth } = require("./middlewares/AuthMiddleware");
const TodoModel = require("./models/TodoModel");

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
app.use(express.static("public"));

const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: "This is Todo app, we dont love coding",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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
      const userDb = await user.save(); //create a user in DB
      console.log(userDb);
      return res.redirect("/login");
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

app.post("/login", async (req, res) => {
  //validate the data
  console.log(req.body);
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "missing credentials",
    });
  }

  if (typeof loginId !== "string" || typeof password !== "string") {
    return res.send({
      status: 400,
      message: "Invalid data format",
    });
  }

  //identify the loginId and search in database

  try {
    let userDb;
    if (validator.isEmail(loginId)) {
      userDb = await userSchema.findOne({ email: loginId });
    } else {
      userDb = await userSchema.findOne({ username: loginId });
    }

    if (!userDb) {
      return res.send({
        status: 400,
        message: "User not found, Please register first",
      });
    }

    //password compare bcrypt.compare
    const isMatch = await bcrypt.compare(password, userDb.password);

    if (!isMatch) {
      return res.send({
        status: 400,
        message: "Password Does not match",
      });
    }

    //Add session base auth sys
    console.log(req.session);
    req.session.isAuth = true;
    req.session.user = {
      username: userDb.username,
      email: userDb.email,
      userId: userDb._id,
    };

    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/dashboard", isAuth, async (req, res) => {
  return res.render("dashboard");
});

//logout api's
app.post("/logout", isAuth, (req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) throw err;

    return res.redirect("/login");
  });
});

app.post("/logout_from_all_devices", isAuth, async (req, res) => {
  const username = req.session.user.username;

  //create a session schema
  const Schema = mongoose.Schema;
  const sessionSchema = new Schema({ _id: String }, { strict: false });
  const sessionModel = mongoose.model("session", sessionSchema);

  try {
    const deletionCount = await sessionModel.deleteMany({
      "session.user.username": username,
    });
    console.log(deletionCount);
    return res.send({
      status: 200,
      message: "Logout from all devices successfully",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Logout Failed",
      error: error,
    });
  }
});

//todo's api
app.post("/create-item", isAuth, async (req, res) => {
  console.log(req.body);

  const todoText = req.body.todo;

  //data validation
  if (!todoText) {
    return res.send({
      status: 400,
      message: "Todo is Empty",
    });
  }

  if (typeof todoText !== "string") {
    return res.send({
      status: 400,
      message: "Invalid Todo format",
    });
  }

  if (todoText.length > 100) {
    return res.send({
      status: 400,
      message: "Todo is too long, should be less than 100 char.",
    });
  }

  //intialize todo schema and store it in Db
  const todo = new TodoModel({
    todo: todoText,
    username: req.session.user.username,
  });

  try {
    const todoDb = await todo.save();

    console.log(todo);
    return res.send({
      status: 201,
      message: "Todo created successfully",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.post("/edit-item", isAuth, async (req, res) => {
  console.log(req.body);

  const { id, newData } = req.body;

  //data validation
  if (!id || !newData) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }
  if (typeof newData !== "string") {
    return res.send({
      status: 400,
      message: "Invalid Todo format",
    });
  }

  if (newData.length > 100) {
    return res.send({
      status: 400,
      message: "Todo is too long, should be less than 100 char.",
    });
  }

  try {
    const todoDb = await TodoModel.findOneAndUpdate(
      { _id: id },
      { todo: newData }
    );
    console.log(todoDb);

    return res.send({
      status: 200,
      message: "Todo updated Successfully",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.post("/delete-item", isAuth, async (req, res) => {
  console.log(req.body);

  const id = req.body.id;

  //data validation
  if (!id) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  try {
    const todoDb = await TodoModel.findOneAndDelete({ _id: id });
    console.log(todoDb);

    return res.send({
      status: 200,
      message: "Todo deleted Successfully",
      data: todoDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/read-item", async (req, res) => {
  console.log(req.session.user.username);
  const user_name = req.session.user.username;
  try {
    const todos = await TodoModel.find({ username: user_name });

    if (todos.length === 0)
      return res.send({
        status: 400,
        message: "Todo is empty, Please create some.",
      });

    return res.send({
      status: 200,
      message: "Read Success",
      data: todos,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
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
//session base auth

//Dashbaord
//logout
//logout from all devices
//Todo's
//create a schema for todo
//create a todo
//edit a todo
//delete a todo
//show the todos on dashboard page

//Broswer.js
//axios
//read, edit and delete call from axios (client-side)

//pagination
//rate-limiting
//Deploy

//client(axios) ----REST API---> Server(Express routes) ---> Database (Mongodb)
