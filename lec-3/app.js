const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("This is your server");
});

app.get("/myapp", (req, res) => {
  return res.send("This is your GET reuest");
});

app.post("/myapp", (req, res) => {
  return res.send("This is your POST request");
});

//query
app.get("/api", (req, res) => {
  console.log(req.query);
  return res.send("This is /api GET");
});

//params
app.get("/api1/:id", (req, res) => {
  console.log(req.params.id);
  return res.send("GET /api/:id is working");
});

// app.get("/api1/:id1/:id2", (req, res) => {
//   console.log(req.params);
//   return res.send("GET /api/:id1/:id2 is working");
// });

app.get("/api1/:id/api2", (req, res) => {
  console.log("GET /api1/:id/api2 Working");
  const value = req.params.id;
  return res.send(`Value : ${value}`);
});

app.get("/myhtml", (req, res) => {
  return res.send(`
    <html>
    <body>
    <h1>This is Form</h1>

    <form action='/form_submit' method='POST'>
    <label for='name'>Name</label>
    <input type='text' name='name'> </input>

    <label for='email'>Email</label>
    <input type='text' name='email'> </input>

    <label for='pass'>Password</label>
    <input type='text' name='pass'> </input>

    <label for='username'>Username</label>
    <input type='text' name='username'> </input>

    <button type='submit'>Submit</button>

    </form>

    </body>
    </html>
    `);
});

app.post("/form_submit", (req, res) => {
  console.log(req.body);
  return res.send("Form submitted successfully");
});

app.listen(8000, () => {
  console.log("server is running or port 8000");
});

//client --> req --> server
// client <-- res <--- server

//key=100,200
//key1=100&key2=200

//  /api/karan  , /api/vinay , /api/aman
