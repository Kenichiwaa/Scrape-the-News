
// grab articles as a JSON object
$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

$(document).on("click", "p", function() {
  // Empty notes section to populate
  $("#notes").empty();
  // Save id from the p tag
  var thisId = $(this).attr("data-id");
  // Make an AJAX call for the articles
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  .done(function(data) {
    $("#notes").append("<input id='titleinput' name='title'>");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append("<button data-id='" + data._id + "id='savenote'> Save Note</button");
  });
  // Add the note info to the page
});
