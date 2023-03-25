/*************************************************************************************
 * WEB322 - Assignment 5
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Student Name  : Jason Shin
 * Student ID    : 111569216
 * Date          : Mar 24, 2023
 * Course/Section: WEB322/NGG
 * Online (Cyclic) URL: https://blue-different-spider.cyclic.app/
 *
 **************************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const blogService = require("./blog-service.js");
const exphbs = require("express-handlebars");
const stripJs = require("strip-js");

//Inside your server.js file "require" the libraries:
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

//Set Cloudinary config
cloudinary.config({
  cloud_name: "dlzmn4koa",
  api_key: "726729223185397",
  api_secret: "d3hoQr62EI491qvMHdOYLKzO_4k",
  secure: true,
});

const upload = multer();

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
      safeHTML: function (context) {
        return stripJs(context);
      },
      formatDate: function (dateObj) {
        let year = dateObj.getFullYear();
        let month = (dateObj.getMonth() + 1).toString();
        let day = dateObj.getDate().toString();
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      },
    },
  })
);

app.set("view engine", ".hbs");

//function onHttpStart() {
//  console.log("Express http server listening on: " + HTTP_PORT);
//}

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/blog");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/blog", async (req, res) => {
  // assignment 4
  // Declare an object to store properties for the view
  let viewData = {};
  try {
    // declare empty array to hold "post" objects
    let posts = [];
    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blogService.getPublishedPostsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      posts = await blogService.getPublishedPosts();
    }
    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    // get the latest post from the front of the list (element 0)
    let post = posts[0];
    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
    viewData.post = post;
  } catch (err) {
    viewData.message = "no results";
  }
  try {
    // Obtain the full list of "categories"
    let categories = await blogService.getCategories();
    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }
  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});

app.get("/categories", (req, res) => {
  blogService
    .getCategories()
    .then((data) => {
      console.log("getCategories");
      data.length > 0
        ? res.render("categories", { categories: data })
        : res.render("categories", { message: "no results" });
    })
    .catch((err) => {
      console.log("Unable to open the file: " + err);
      res.render("categories", { message: "no results" });
    });
});

app.get("/categories/add", (req, res) => {
  res.render("addCategory");
});

app.post("/categories/add", (req, res) => {
  blogService
    .addCategory(req.body)
    .then((category) => {
      res.redirect("/categories");
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/posts", (req, res) => {
  let query = null;
  if (req.query.category) {
    query = blogService.getPostsByCategory(req.query.category);
    console.log("getPostsByCategory");
  } else if (req.query.minDate) {
    query = blogService.getPostsByMinDate(req.query.minDate);
    console.log("getPostsByMinDate");
  } else {
    query = blogService.getAllPosts();
    console.log("getAllPosts");
  }
  query
    .then((data) => {
      data.length > 0
        ? res.render("posts", { posts: data })
        : res.render("posts", { message: "no results" });
    })
    .catch((err) => {
      console.log("Error has occurred" + err);
      res.render("posts", { message: "no results" });
    });
});

app.get("/posts/add", (req, res) => {
  blogService
    .getCategories()
    .then((data) => {
      res.render("addPost", { categories: data });
    })
    .catch((err) => {
      res.render("addPost", { categories: [] });
    });
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

app.get("/posts/delete/:id", (req, res) => {
  blogService
    .deletePostById(req.params.id)
    .then(() => {
      res.redirect("/posts");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Post / Post Not Found");
    });
});

app.get("/categories/delete/:id", (req, res) => {
  blogService
    .deleteCategoryById(req.params.id)
    .then(() => {
      res.redirect("/categories");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Category / Category Not Found");
    });
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
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
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }
  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;
    console.log(req.body);
    blogService.addPost(req.body).then((post) => {
      res.redirect("/posts");
    });
  }
});

app.get("/blog/:id", async (req, res) => {
  //assignment 4
  // Declare an object to store properties for the view
  let viewData = {};
  try {
    // declare empty array to hold "post" objects
    let posts = [];
    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blogService.getPublishedPostsByCategory(req.query.category);
    } else {
      // Obtain the published "posts"
      posts = await blogService.getPublishedPosts();
    }
    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
  } catch (err) {
    viewData.message = "no results";
  }
  try {
    // Obtain the post by "id"
    viewData.post = await blogService.getPostById(req.params.id);
  } catch (err) {
    viewData.message = "no results";
  }
  try {
    // Obtain the full list of "categories"
    let categories = await blogService.getCategories();

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }
  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found 404");
});

blogService
  .initialize()
  .then(() => {
    console.log("blogService initialized then!");
    app.listen(HTTP_PORT, () => {
      console.log("server listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("blogService initialize error has occurred:" + err);
  });
