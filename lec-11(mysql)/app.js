const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json());

//db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Karan@130101",
  database: "tododb",
  multipleStatements: true,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Mysql database is connected!");
});

app.get("/", (req, res) => {
  return res.send("Mysql app");
});

//get requets
app.get("/todo", (req, res) => {
  db.query("SELECT * FROM users", {}, (err, users) => {
    if (err) {
      console.log(err);
      return res.send({
        status: 500,
        message: "Database error",
        error: err,
      });
    }

    console.log(users);
    if (users) {
      return res.send({
        status: 200,
        message: "Read sucess",
        data: users,
      });
    } else {
      return res.send({
        status: 200,
        message: "Empty data",
      });
    }
  });
});

app.post("/create-user", (req, res) => {
  console.log(req.body);
  const { userName, email, password, todoId } = req.body;

  db.query(
    "INSERT INTO users (todoId, userName, email, password) VALUES (?,?,?,?)",
    [todoId, userName, email, password],
    (err, data) => {
      if (err) {
        console.log(err);
        return res.send({
          status: 500,
          message: "Database error",
          error: err,
        });
      } else {
        return res.status(200).send(true);
      }
    }
  );
});

app.listen(8000, () => {
  console.log("Server is running port 8000");
});
