/*************************************************************************************
 * WEB322 - Assignment 5
 * I declare that this assignment is my own work in accordance with the Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Student Name  : Jason Shin
 * Student ID    : 111569216
 * Date:         : Mar 24, 2023
 * Course/Section: WEB322/NGG
 * Online (Cyclic) URL: https://blue-different-spider.cyclic.app/
 *
 **************************************************************************************/
//const file = require("fs"); // required at the top of your module
//var posts = [];
//var categories = [];
const Sequelize = require("sequelize");

var sequelize = new Sequelize("styiccqd", "styiccqd", "2JUd9gATPj3BTTGgqUYPYikdMS1twOpO", {
  host: "fanny.db.elephantsql.com",
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
  query: { raw: true },
});

var Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, { foreignKey: "category" });

module.exports.initialize = function () {
  return sequelize.sync();
};

module.exports.getAllPosts = function () {
  return new Promise((res, rej) => {
    Post.findAll()
      .then((data) => {
        res(data);
      })
      .catch((err) => {
        rej("no results returned");
      });
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((res, rej) => {
    Post.findAll({
      where: {
        published: true,
      },
    })
      .then((data) => {
        res(data);
      })
      .catch(() => {
        rej("no results returned");
      });
  });
};

module.exports.getCategories = function () {
  return new Promise((res, rej) => {
    Category.findAll()
      .then((data) => {
        res(data);
      })
      .catch((err) => {
        rej("no results returned");
      });
  });
};

module.exports.addPost = function (postData) {
  return new Promise((res, rej) => {
    postData.published = postData.published ? true : false;
    for (var i in postData) {
      if (postData[i] === "") postData[i] = null;
    }
    postData.postDate = new Date();
    Post.create(postData)
      .then(() => {
        res();
      })
      .catch((e) => {
        rej("unable to create post");
      });
  });
};

module.exports.addCategory = function (categoryData) {
  return new Promise((res, rej) => {
    for (var j in categoryData) {
      if (categoryData[j] === "") categoryData[j] = null;
    }
    Category.create(categoryData)
      .then(() => {
        res();
      })
      .catch((err) => {
        rej("unable to create category");
      });
  });
};

module.exports.getPostsByCategory = function (category) {
  return new Promise((res, rej) => {
    Post.findAll({
      where: {
        category: category,
      },
    })
      .then((data) => {
        res(data);
      })
      .catch(() => {
        rej("no results returned");
      });
  });
};

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((res, rej) => {
    Post.findAll({
      where: {
        published: true,
        category: category,
      },
    })
      .then((data) => {
        res(data);
      })
      .catch(() => {
        rej("no results returned");
      });
  });
};

module.exports.getPostsByMinDate = function (minDateStr) {
  const { gte } = Sequelize.Op;
  return new Promise((res, rej) => {
    Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr),
        },
      },
    })
      .then((data) => {
        res(data);
      })
      .catch((err) => {
        rej("no results returned");
      });
  });
};

module.exports.getPostById = function (id) {
  return new Promise((res, rej) => {
    Post.findAll({
      where: {
        id: id,
      },
    })
      .then((data) => {
        res(data[0]);
      })
      .catch((err) => {
        rej("no results returned");
      });
  });
};

module.exports.deletePostById = function (id) {
  return new Promise((res, rej) => {
    Post.destroy({
      where: {
        id: id,
      },
    })
      .then((data) => {
        res();
      })
      .catch(() => {
        rej("unable to delete post");
      });
  });
};

module.exports.deleteCategoryById = function (id) {
  return new Promise((res, rej) => {
    Category.destroy({
      where: {
        id: id,
      },
    })
      .then((data) => {
        res();
      })
      .catch(() => {
        rej("unable to delete category");
      });
  });
};
