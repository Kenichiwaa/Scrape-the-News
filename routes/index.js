var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/week18day3mongoose');
 var db = mongoose.connection;

// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// show mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// one time listener function for the event "open"
db.once("open", function() {
  console.log("Mongoose connection successful");
});

// routes
// ======


/* home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


// -----------------------------------------------
// ------------ Grab all articles ----------------
router.get("/articles", function(req, res) {

  Article.find({}, function(err, doc) {
    if(err) {
      console.log("Article get error :" + err);
    }
    else {
      res.json(doc);
    }
  });
});

// ---------------------------------------
// -- Grab all with saveArticle as true --

router.get("/saved", function(req, res) {
  Article.find({ "saveArticle": true }, function(err, doc) {
    if(err) {
      console.log("Error finding saved articles: " + err);
    }
    // send json object to the broswer
    else {
      res.json(doc);
      console.log("Saved articles: " + doc);
    }
  });
});

// ---------------------------------------
// ------- Scrape the Internet -----------
router.get("/scrape", function(req, res) {

    request('http://www.roadandtrack.com/', function(error, response, html) {
        var $ = cheerio.load(html);
        $('a.landing-feed--story-title').each(function(i, element) {
            var result = {};
            result.title = $(element).text();
            result.link = 'http://www.roadandtrack.com' + $(element).attr("href");
            result.saveArticle = false;

            var entry = new Article(result);
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(doc);
                }
            });
        });
    });
    res.send("Scrape Complete");
});

// -----------------------------------------------
// ---------------- Create a note  ---------------

// grab articles by article ID
router.get("/articles/:id", function(req, res) {

    Article.findOne(
        {"_id":
              req.params.id
        })
      .populate("note")
      .exec(function(err, doc) {
        if (err) {
            console.log("Populating note error :" + err);
        } else {
            res.json(doc);
        }
    });
});

// -----------------------------------------------
// ------------ Create a New Note ----------------

// Create a new note, or replace an existing one
router.post("/articles/:id", function(req, res) {
  // create a new note and pass req.body to it
  var newNote = new Note(req.body);

  newNote.save(function(err, doc) {
    if(err) {
      console.log("Error saving new note: " + err);
    }
    else {
      Article.findOneAndUpdate(  {
                                  "_id": req.params.id
                                 }, {
                                   "note": doc._id
                                 } )
      .exec(function(err, doc) {
        if(err) {
          console.log("Error finding article to update with note :" + err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});

// -----------------------------------------------
// ------------ Archive and Article --------------

router.post("/saveArticle/:id", function(req, res) {
  Article.findOneAndUpdate( {"_id": req.params.id,}, {"saveArticle": true} )
          .exec(function(err, doc) {
            if(err) {
              console.log("Error finding article to update with note :" + err);
            }
            else {
              res.send("Article saved!: " + doc);
            }
          });
});

// ------------------------------------------------
// ---------- Remove an Article -------------------

router.post("/deleteArticle/:id", function(req, res) {
  Article.findOneAndUpdate( {"_id": req.params.id,}, {"saveArticle": false} )
          .exec(function(err, doc) {
            if(err) {
              console.log("Error finding article to update with note :" + err);
            }
            else {
              res.send("Article saved!: " + doc);
            }
          });
});

// -----------------------------------------------
// -----------------------------------------------

module.exports = router;
