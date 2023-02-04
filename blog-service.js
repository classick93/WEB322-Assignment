/*************************************************************************************
 * WEB322 - Assignment 2
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Student Name  : Jason Shin
 * Student ID    : 111569216
 * Date:         : Feb 3, 2023
 * Course/Section: WEB322/NGG
 * Online (Cyclic) URL: https://blue-different-spider.cyclic.app/
 *
 **************************************************************************************/

const file = require("fs"); // required at the top of your module
var posts = []; // posts declared as array globally 
var categories = []; // categories declared as array globally

module.exports.initialize = () => {
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
       }
    });
    res();
  });
};

module.exports.getAllPosts = () => {
  var allPosts = [];
  return new Promise((res, rej) => {
    for (var i = 0; i < posts.length; i++) {
      allPosts.push(posts[i]);
    }
    if (allPosts.length === 0) {
      rej("no results returned");
    }
    res(allPosts);
  });
};

module.exports.getPublishedPosts = () => {
  var publishedPosts = [];
  return new Promise((res, rej) => {
    for (var j = 0; j < posts.length; j++) {
      if (posts[j].published == true) {
        publishedPosts.push(posts[j]);
      }
    }

    if (publishedPosts.length === 0) {
      rej("no results returned");
    }
    res(publishedPosts);
  });
};

module.exports.getCategories = () => {
  return new Promise((res, rej) => {
    if (categories.length == 0) {
      rej("no results returned");
    } else {
      res(categories);
    }
  });
};
