/*************************************************************************************
* WEB322 - Assignment 1
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Jason Shin
* Student ID    : 111569216
* Date: January 20, 2023
* Course/Section: WEB322/NGG
* Online (Cyclic) URL: https://black-bullfrog-gear.cyclic.app 
*
**************************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Jason Shin - 111569216");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);