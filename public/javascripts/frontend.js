

$(document).ready(function(){

  $.getJSON('/tags', function(data) {
  var items = [];

  $.each(data.rows, function(i, item) {
    //items.push('<tr><td>' + data.rows[i].key + '</td><td>' + data.rows[i].value + '</td></tr>');
    items.push({"text": data.rows[i].key, "weight": data.rows[i].value});
  });

  $("#tagcloud").jQCloud(items);
 
  });
    
  $('#add_post_button').click(function() {
    $('#add_post').load('/add');
  });

});