/*************************************************************************************
 * WEB322 - Assignment 4
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Student Name  : Jason Shin
 * Student ID    : 111569216
 * Date:         : Mar 10, 2023
 * Course/Section: WEB322/NGG
 * Online (Cyclic) URL: https://blue-different-spider.cyclic.app/
 *
 **************************************************************************************/
const file = require("fs"); // required at the top of your module
var posts = [];
var categories = [];

module.exports.initialize = function () {
  return new Promise((res, rej) => {
    file.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) {
        rej(err);
        console.log("Unable to read file" + err);
      } else {
        posts = JSON.parse(data);
      }
    });
    file.readFile("./data/categories.json", "utf8", (err, data) => {
      if (err) {
        rej(err);
        console.log("Unable to read file" + err);
      } else {
        categories = JSON.parse(data);
        res();
      }
    });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((res, rej) => {
    if (posts.length === 0) {
      rej("No results returned");
    } else {
      res(posts);
    }
  });
};

module.exports.getPublishedPosts = function () {
  var publishedPosts = [];
  return new Promise((res, rej) => {
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].published == true) {
        publishedPosts.push(posts[i]);
      }
    }
    if (publishedPosts.length === 0) {
      rej("No results returned");
    }
    res(publishedPosts);
  });
};

module.exports.getCategories = function () {
  return new Promise((res, rej) => {
    if (categories.length == 0) {
      rej("No results returned");
    } else {
      res(categories);
    }
  });
};

module.exports.addPost = function (postData) { //assignment 4
  return new Promise((res, rej) => {
    if (postData.published == undefined) {
      postData.published = false;
    } else {
      postData.published = true;
    }
    postData.id = posts.length + 1;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    postData.postDate = today;
    posts.push(postData);
    res(postData);
  });
};

module.exports.getPostsByCategory = function (category) {
  return new Promise((res, rej) => {
    let category_filter = posts.filter((p) => p.category == category);
    if (category_filter.length == 0) {
      rej("No results returned");
    } else {
      res(category_filter);
    }
  });
};

module.exports.getPublishedPostsByCategory = function (category) { // assignment 4
  return new Promise((res, rej) => {
    let category_filter = posts.filter(
      (post) => post.published && post.category == category
    );
    category_filter.length > 0
      ? res(category_filter)
      : rej("No results returned");
  });
};

module.exports.getPostsByMinDate = function (minDateStr) {
  return new Promise((res, rej) => {
    let date_filter = posts.filter(
      (p) => new Date(p.postDate) >= new Date(minDateStr)
    );
    if (date_filter.length == 0) {
      rej("No results returned");
    } else {
      res(date_filter);
    }
  });
};

module.exports.getPostById = function (id) {
  return new Promise((res, rej) => {
    let post_found = posts.find((p) => p.id == id);
    if (post_found) {
      res(post_found);
    } else {
      rej("No result returned");
    }
  });
};
