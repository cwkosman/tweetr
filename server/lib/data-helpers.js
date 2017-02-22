"use strict";

// Defines helper functions for saving and getting tweets, using the database db`
module.exports = function makeDataHelpers(db, collection) {
  return {

    // Saves a tweet to the given db and collection
    saveTweet: function(newTweet, callback) {
      db.collection(collection).insertOne(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection(collection).find().sort("created_at", 1).toArray(callback);
    }
  };
};
