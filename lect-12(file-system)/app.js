const http = require("http");
const fs = require("fs");

const server = http.createServer();

server.on("request", (req, res) => {
  console.log(req.method, " ", req.url);
  const DataString = "Thisssssss is file system class";

  if (req.method === "GET" && req.url === "/") {
    return res.end("This is your home app");
  }

  //create and write in a file
  else if (req.method === "GET" && req.url == "/append") {
    fs.appendFile("demo.txt", DataString, (err) => {
      if (err) throw err;

      console.log("Appended");
      return res.end("Text Appended");
    });
  } else if (req.method === "GET" && req.url == "/writefile") {
    fs.writeFile("demo2.txt", DataString, (err) => {
      if (err) throw err;

      console.log("write File");
      return res.end("Writefile");
    });
  } else if (req.method === "GET" && req.url == "/readfile") {
    fs.readFile("test.html", (err, data) => {
      if (err) throw err;
      console.log(data);
      res.write(data);
      return res.end();
    });
  } else if (req.method === "GET" && req.url == "/deletefile") {
    fs.unlink("demo.txt", (err) => {
      if (err) throw err;
      console.log("Deleted");
      return res.end("File deleted successfully");
    });
  }

  //rename
  else if (req.method === "GET" && req.url == "/renamefile") {
    fs.rename("demo.txt", "newDemo.txt", (err) => {
      if (err) throw err;
      console.log("Rename");
      return res.end("File Rename successfully");
    });
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
