const mongoose = require("mongoose");
const clc = require("cli-color");

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => {
    console.log(clc.yellow.underline("mongoDb is connected"));
  })
  .catch((err) => {
    console.log(clc.red(err));
  });
