"use strict";
const ObjectId = require("mongodb").ObjectId;

// Defines helper functions for saving and getting tweets, using the database db`
module.exports = function makeDataHelpers(db, collection) {
  return {

    // Saves a tweet to the given db and collection
    saveTweet: function(newTweet, callback) {
      console.log(newTweet);
      db.collection(collection).insertOne(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection(collection).find().sort("created_at", 1).toArray(callback);
    },

    likeTweet: function(tweetId, isLiked, callback) {
      if (isLiked) {
        db.collection(collection).update(
          {"_id": ObjectId(tweetId) },
          {
            $inc: {"likes": -1},
            $set: {"liked": ""}
          },
          callback);
      } else if (!isLiked) {
        db.collection(collection).update(
          {"_id": ObjectId(tweetId) },
          {
            $inc: {"likes": 1},
            $set: {"liked": true}
          },
          callback);
      }

      // console.log(db.collection(collection).find( {"_id": tweetId }, { $inc: { likes: 1 } }, callback);
      // } else {
      //   db.
      //     query: { "_id": tweetId },
      //     update: { $inc: { "likes": 1 } }
      //   });
      // }
    }
  };
};
