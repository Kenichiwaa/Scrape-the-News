// Dependencies

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

// Dependencies for scraping
var request = require("request");
var cheerio = require("cheerio");

// promise for mongoose
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Initialize express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// use public directory
app.use(express.static("public"));

// configure database with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;

// show mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// one time listener function for the event "open"
db.once("open", function() {
  console.log("Mongoose connection successful");
});

// Routes
// ======

// Index route
app.get("/", function(req, res) {
  res.send(index.html);
});

// route that sends mongo database
app.get("/all", function(req, res) {
  console.log("I am in the route all!");
  db.scrapedData.find({}, function(error, found) {
    res.json(found);
    console.log("results!");
    console.log(found);
  });
});

app.get("/scrape", function(req, res) {

  request('http://www.roadandtrack.com/', function (error, response, html) {
    var $ = cheerio.load(html);
    var result = [];

    $('a.landing-feed--story-title').each(function(i, element){

      var link = $(element).attr("href");
      var title = $(element).text();
      var picture = $(element).closest("img")[0];

      // Save these results in an object that we'll push into the result array we defined earlier
      result.push({
        title: title,
        link: 'http://www.roadandtrack.com' + link,
        picture: "picture" + picture
      });
      });
    db.scrapedData.insert(result, function(result) {
      res.send("successful");
    });
    console.log(result);
    console.log("scrapped data");
  });

});








// listen on port 3000
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("App running on port: " + PORT);
});
