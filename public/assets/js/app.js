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
      var count = 0;
      for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p class='well' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].text + "<button type='button' "+ "data-id='" + data[i]._id +"' id='saveArticle' class='btn btn-secondary'>Save!</button></p>");
        count++;
      }
      $('.modal-body').text("Added " + count + "new articles!");
      $('#myModal').modal('show');
      count = 0;
    });
});
// ----------------------------------------------
// ----------------------------------------------

$(document).on("click", "#saved", function() {
  $("#articles").empty();
    $.ajax({
      method: "GET",
      url: "/saved"
    })
    .done(function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var container = $("<section class='well'>")
          .append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].text )
          .append("<button type='button' "+ "data-id='" + data[i]._id +"' id='addNote' class='btn btn-secondary'>Add Note</button>")
          .append("<button type='button' "+ "data-id='" + data[i]._id +"' id='deleteArticle' class='btn btn-secondary'>Delete</button>");
        $("#articles").append(container);
      }
    });
});

// ----------------------------------------------
// ----------------------------------------------

$(document).on("click", "#addNote", function() {
    $(".modal-body").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).done(function(data) {

        $(".modal-body").append("<h2>" + data.title + "</h2>");
        $(".modal-body").append("<input id='titleinput' name='title'>");
        $(".modal-body").append("<textarea id='bodyinput' name='body'></textarea>");
        $(".modal-body").append("<button data-id='" + data._id + "' id='savenote'> Save Note</button");
        $('#myModal').modal('show');

        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

// ----------------------------------------------
// ----------------------------------------------


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
    }).done(function(data) {
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
