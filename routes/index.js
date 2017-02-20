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


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// grab articles from mongoose
router.get("/articles", function(req, res) {

  Article.find({}, function(err, doc) {
    if(err) {
      console.log("Article get error :" + err);
    }
    // send json object to the broswer
    else {
      res.json(doc);
    }
  });
});

router.get("/saved", function(req, res) {
  Article.find({saveArticle: true}, function(err, doc) {
    if(err) {
      console.log("Error finding saved articles: " + err);
    }
    // send json object to the broswer
    else {
      res.json(doc);
    }
  });
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// I think you need to have an empty array outside the .each function
// and inside the .each function declare a result object. Build it, then push
// to the array at the end of the .each loop. Then send the array filled with
// results objects


// // scrape from website
router.get("/scrape", function(req, res) {
  // request site to scrape and return data as a callback
  request('http://www.roadandtrack.com/', function (error, response, html) {
    var $ = cheerio
      .load(html);
    // select desired classes to target
    $('a.landing-feed--story-title')
      .each(function(i, element){
        var result = {};
        // Save these results in an object that we'll push into the result array we defined earlier
        result.title = $(element).text();
        result.link = 'http://www.roadandtrack.com' + $(element).attr("href");
        result.saveArticle = false;
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(result);

        // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            //console.log(doc);
          }
        });
    });
  });
  res.send("Scrape Complete");
});


// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------

// scrape from website
// router.get("/scrape", function(req, res) {
//   // request site to scrape and return data as a callback
//   request('http://www.roadandtrack.com/', function (error, response, html) {
//     var $ = cheerio.load(html);
//     // select desired classes to target
//     $('a.landing-feed--story-title').each(function(i, element){
//
//       // Save these results in an object that we'll push into the result array we defined earlier
//       var result = {};
//       result.title = $(element).text();
//       result.link = 'http://www.roadandtrack.com' + $(element).attr("href");
//
//       // create new entry using Article model
//       var entry = new Article(result);
//
//       entry.save(function(err, doc) {
//         if(err) {
//           console.log("Article save error :" + err);
//         }
//         else {
//           console.log(doc);
//           res.json(doc);
//         }
//       });
//     });
//   });
//   res.send("Scrape Complete");
// });

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// grab articles by article ID
router.get("/articles/:id", function(req, res) {
  Article.findOne({"_id": req.params.id})
  // populate note associated with this id
  .populate("note")
  // execute the query
  .exec(function(err, doc) {
    // log any errors
    if(err) {
      console.log("Populating note error :" + err);
    }
    else {
      res.json(doc);
    }
  });
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// Create a new note, or replace an existing one
router.post("/articles/:id", function(req, res) {
  // create a new note and pass req.body to it
  var newNote = new Note(req.body);

  newNote.save(function(err, doc) {
    if(err) {
      console.log("Error saving new note: " + err);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id} )
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


module.exports = router;
