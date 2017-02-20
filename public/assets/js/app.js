// ----------------------------------------------
// ----------------------------------------------
$(document).on("click", "#scrape", function() {
  $("#articles").empty();
    $.ajax({
      method: "GET",
      url: "/articles"
    })
    .done(function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p class='well' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].text + "<button type='button' "+ "data-id='" + data[i]._id +"' id='addNote' class='btn btn-secondary'>Add Note</button><button type='button' "+ "data-id='" + data[i]._id +"' id='saveArticle' class='btn btn-secondary'>Save!</button></p>");
      }
    });
});
// ----------------------------------------------
// ----------------------------------------------/

$(document).on("click", "#saved", function() {
  var count = 0;
  $("#articles").empty();
    $.ajax({
      method: "GET",
      url: "/saved"
    })
    .done(function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p class='well' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].text + "<button type='button' "+ "data-id='" + data[i]._id +"' id='addNote' class='btn btn-secondary'>Add Note</button><button type='button' "+ "data-id='" + data[i]._id +"' id='deleteArticle' class='btn btn-secondary'>Delete</button></p>");
        count++;
      }
    });

});

// grab articles as a JSON object
// $(document).on("click", "#scrape", function() {
//   var count = 0;
//   $.getJSON("/scrape", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].text + "</p>");
//       count++;
//     }
//   })
  // .done(function() {
  //   $('.modal-body').text("Added " + count + "new articles!");
  //   $('#myModal').modal('show');
  //   count = 0;
  // });
// });

$(document).on("click", "#addNote", function() {
  // Empty notes section to populate

  $(".modal-body").empty();
  // Save id from the p tag
  var thisId = $(this).attr("data-id");
  // Make an AJAX call for the articles
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  .done(function(data) {

    $(".modal-body").append("<h2>" + data.title + "</h2>");
    $(".modal-body").append("<input id='titleinput' name='title'>");
    $(".modal-body").append("<textarea id='bodyinput' name='body'></textarea>");
    $(".modal-body").append("<button data-id='" + data._id + "' id='savenote'> Save Note</button");
    $('#myModal').modal('show');

    if(data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
});
//     $('.modal-body').text("Added " + count + "new articles!");
//     $('#myModal').modal('show');

// save note to database on click
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
    .done(function(data) {
      console.log("save note function data: " + data);
      $("#notes").empty();
    });
    // clear note area
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


// save article to database
$(document).on("click", "#saveArticle", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/saveArticle/" + thisId,
    data: {
      saveArticle: true
    }
  }).done(function(err, data) {
    if(err) {
      console.log("Error saving article: " + err);
    }
    else {
      console.log("Saved article: " + data);
    }
  });
});

// save article to database
$(document).on("click", "#deleteArticle", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/deleteArticle/" + thisId,
    data: {
      saveArticle: false
    }
  }).done(function(err, data) {
    if(err) {
      console.log("Error removing article: " + err);
    }
    else {
      console.log("Removed article: " + data);
    }
  });
});
