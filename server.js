/*************************************************************************************
 * WEB322 - Assignment 3
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Student Name  : Jason Shin
 * Student ID    : 111569216
 * Date          : Feb 19, 2023
 * Course/Section: WEB322/NGG
 * Online (Cyclic) URL: https://blue-different-spider.cyclic.app/
 *
 **************************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const path = require("path");
const blogService = require("./blog-service.js");

//Inside your server.js file "require" the libraries: (assignment 3)
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

//Set the cloudinary config (assignment 3)
cloudinary.config({
  cloud_name: "dlzmn4koa",
  api_key: "726729223185397",
  api_secret: "d3hoQr62EI491qvMHdOYLKzO_4k",
  secure: true,
});

//Finally, create an "upload" variable without any disk storage, ie: (assignment 3)
const upload = multer(); // no { storage: storage } since we are not using disk storage

app.use(express.static("public"));

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/blog", (req, res) => {
  blogService
    .getPublishedPosts()
    .then((data) => {
      console.log("getPublishedPosts.json");
      res.json(data);
    })
    .catch((err) => {
      console.log("Unable to open the file: " + err);
      res.json({ message: err });
    });
});

app.get("/categories", (req, res) => {
  blogService
    .getCategories()
    .then((data) => {
      console.log("getCategories.json");
      res.json(data);
    })
    .catch((err) => {
      console.log("Unable to open the file: " + err);
      res.json({ message: err });
    });
});
//assignment 3-main begin//
app.get("/posts", (req, res) => {
  let query_prom = null;
  if (req.query.category) {
    query = blogService.getPostsByCategory(req.query.category);
  } else if (req.query.minDate) {
    query = blogService.getPostsByMinDate(req.query.minDate);
  } else {
    query = blogService.getAllPosts();
  }
  query_prom
    .then((data) => {
      console.log("Getting posts query");
      res.json(data);
    })
    .catch((err) => {
      console.log("Error has occurred" + err);
      res.json({ message: err });
    });
});

app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
});

app.get("/posts/:id", (req, res) => {
  blogService
    .getPostById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }
  upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url;
    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    blogService
      .addPost(req.body)
      .then(() => {
        res.redirect("/posts");
      })
      .catch((data) => {
        res.send(data);
      });
  });
});
//assignment 3-end//

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

blogService
  .initialize()
  .then(() => {
    console.log("Initialized!");
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch((err) => {
    console.log("Initialize error has occurred:" + err);
  });
