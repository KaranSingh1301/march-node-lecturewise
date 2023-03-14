const express = require("express");
const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

const app = express();
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.3ije6wh.mongodb.net/testMarchDb`;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: "This is node march class",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//mongoDb connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  return res.send("This is your server");
});

app.get("/myhtml", (req, res) => {
  return res.send(`<html>
    <head></head>
    <body>
    <h3>This is FORM</h3>
    <form action="/register" method="POST"> 
    <label for="name">Name</label>
    <input type="text" name="name"></input>
    <label for="email">Email</label>
    <input type="text" name="email"></input>
    <label for="tele">Tele</label>
    <input type="text" name="tele"></input>
    <label for="password">Password</label>
    <input type="text" name="password"></input>
    <button type="submit">Submit</button>
    </form>
    </body>
    </html>`);
});

app.post("/register", async (req, res) => {
  console.log(req.body);

  const { name, email, password, tele } = req.body;

  const user = new userSchema({
    name1: name,
    email: email,
    tele: tele,
    password: password,
  });

  try {
    const userDb = await user.save(); //5sec

    //storing session in Db
    req.session.isAuth = true;
    req.session.userEmail = email;

    console.log(req.session);

    return res.send({
      status: 201,
      message: "Register Success",
      data: userDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 400,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/dashboard", (req, res) => {
  console.log(req.session);
  if (req.session.isAuth) {
    return res.send("Restricted page data");
  } else {
    return res.send("Invalid session, please login again");
  }
});

app.listen(8000, () => {
  console.log("server is running or port 8000");
});

//mongoose --> schema ---> userSchema --> user.save()
