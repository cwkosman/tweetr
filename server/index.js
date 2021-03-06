"use strict";
require('dotenv').config();
// Basic express setup:

const PORT          = process.env.PORT || 5000;
const express       = require("express");
const bodyParser    = require("body-parser");
const sassMiddleware = require('node-sass-middleware');
const path           = require('path');
const app           = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(sassMiddleware({
  src: path.join(__dirname, "..", "scss"),
  dest: path.join(__dirname, "..", "public", "styles"),
  force: true,
  debug: true,
  outputStyle: 'compressed',
  prefix: "/styles"
}));

app.use(express.static("public"));

//Return the functions created by the modules, but do not pass an argument to call them.
const DataHelpers = require("./lib/data-helpers.js");
const tweetsRoutes = require("./routes/tweets");

//Connect to Mongo for the db, passing db along to the chain of d
//dependent module functions.
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  app.use("/tweets", tweetsRoutes(DataHelpers(db, "tweets")));
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
