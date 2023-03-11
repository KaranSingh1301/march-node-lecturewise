//ES5
const express = require("express");

const app = express();
app.post("/home", (req, res) => {
  return res.send("This is a post request");
});

app.get("/home", (req, res) => {
  console.log("herddde");
  return res.send("This is your get request");
});

app.listen(8000, () => {
  console.log("Server is running odddn port 8000");
});
