const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();

// server.on("request", (req, res) => {
//   console.log(req.method, " ", req.url);
//   const DataString = "Thisssssss is file system class";

//   if (req.method === "GET" && req.url === "/") {
//     return res.end("This is your home app");
//   }

//   //create and write in a file
//   else if (req.method === "GET" && req.url == "/append") {
//     fs.appendFile("demo.txt", DataString, (err) => {
//       if (err) throw err;

//       console.log("Appended");
//       return res.end("Text Appended");
//     });
//   } else if (req.method === "GET" && req.url == "/writefile") {
//     fs.writeFile("demo2.txt", DataString, (err) => {
//       if (err) throw err;

//       console.log("write File");
//       return res.end("Writefile");
//     });
//   } else if (req.method === "GET" && req.url == "/readfile") {
//     fs.readFile("demo2.txt", (err, data) => {
//       if (err) throw err;
//       //   console.log(data);
//       res.write(data);
//       return res.end();
//     });
//   } else if (req.method === "GET" && req.url == "/deletefile") {
//     fs.unlink("demo.txt", (err) => {
//       if (err) throw err;
//       console.log("Deleted");
//       return res.end("File deleted successfully");
//     });
//   }

//   //rename
//   else if (req.method === "GET" && req.url == "/renamefile") {
//     fs.rename("demo.txt", "newDemo.txt", (err) => {
//       if (err) throw err;
//       console.log("Rename");
//       return res.end("File Rename successfully");
//     });
//   }

//   //creating a stream to read a file
//   else if (req.method === "GET" && req.url == "/streamfile") {
//     const rStream = fs.createReadStream("demo2.txt");

//     rStream.on("data", (char) => {
//       //   console.log(char, " ");
//       res.write(char);
//     });

//     rStream.on("end", () => {
//       return res.end();
//     });
//   }
// });

//upload a file

server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/fileupload") {
    //form submission
    let form = new formidable.IncomingForm();

    form.parse(req, (err, feilds, files) => {
      const oldPath = files.fileToUpload.filepath;

      const newPath =
        __dirname + "/upload/" + files.fileToUpload.originalFilename;

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        return res.end("file uploaded successfully");
      });
    });
  } else {
    //return html form
    fs.readFile("form.html", (err, data) => {
      if (err) throw err;

      res.write(data);
      return res.end();
    });
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
