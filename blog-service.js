/*************************************************************************************
 * WEB322 - Assignment 3
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Student Name  : Jason Shin
 * Student ID    : 111569216
 * Date:         : Feb 19, 2023
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
  return new Promise((res, rej) => {
    if (posts.length === 0) {
      rej("no results returned");
    } else {
      res(posts);
    }
  });
};

module.exports.getPublishedPosts = () => {
  var publishedPosts = [];
  return new Promise((res, rej) => {
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].published == true) {
        publishedPosts.push(posts[i]);
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

module.exports.addPost = (postData) => {
  return new Promise((res, rej) => {
    if (postData.published == undefined) {
      postData.published = false;
    } else {
      postData.published = true;
    }
    postData.id = posts.length + 1;
    posts.push(postData);
    res(postData);
  });
};

module.exports.getPostsByCategory = (category) => {
  return new Promise((res, rej) => {
    var sort_category = [];
    for (var j = 0; j < posts.length; j++) {
      if (posts[j].category == category) {
        sort_category.push(posts[j]);
      }
    }
    if (sort_category == 0) {
      rej("no results returned");
    } else {
      res(sort_category);
    }
  });
};

module.exports.getPostsByMinDate = (minDateStr) => {
  return new Promise(function (res, rej) {
    var posts_date = [];
    for (var k = 0; k < posts.length; k++) {
      if (new Date(posts[k].postDate) >= new Date(minDateStr)) {
        console.log("The postDate value is greater than minDateStr");
        posts_date.push(posts[k]);
      }
    }
    if (posts_date.length == 0) {
      rej("no results returned");
    } else {
      res(posts_date);
    }
  });
};

module.exports.getPostById = (id) => {
  return new Promise((res, rej) => {
    var posts_id = [];
    for (var n = 0; n < posts.length; n++) {
      if (posts[n].id == id) {
        posts_id.push[posts[n]];
      }
    }
    if (posts_id.length == 0) {
      rej("no results returned");
    } else {
      res(posts_id);
    }
  });
};
