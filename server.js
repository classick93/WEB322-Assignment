/*************************************************************************************
 * WEB322 - Assignment 2
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Student Name  : Jason Shin
 * Student ID    : 111569216
 * Date          : Feb 3, 2023
 * Course/Section: WEB322/NGG
 * Online (Cyclic) URL: https://blue-different-spider.cyclic.app/
 *
 **************************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const path = require("path");
const blogService = require("./blog-service.js");

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

app.get("/posts", (req, res) => {
  blogService
    .getAllPosts()
    .then((data) => {
      console.log("getAllPosts.json");
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