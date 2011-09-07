

$(document).ready(function(){

  $.getJSON('/tags', function(data) {
  var items = [];

  $.each(data.rows, function(i, item) {
    //items.push('<tr><td>' + data.rows[i].key + '</td><td>' + data.rows[i].value + '</td></tr>');
    items.push({"text": data.rows[i].key, "weight": data.rows[i].value});
  });
    
    // Only show the tag cloud on the main page
    if ($("#tagcloud").length)  {
      $("#tagcloud").jQCloud(items); 
    }
  
  });
  
  $('#add_post_button').click(function() {
    // This is just loading the page that
    // contains the form
    $('#add_post').load('/add');
  });

  // click to check-off list items
  $("#content li").live({
    click: function () { 
      $(this).addClass("done");
      // Get rid of annoying hilite class
      $(this).removeClass("hilite");
      
      var content = $('#content').html();
      var title = $('#title').html();
      //console.log(foo);
      //alert(window.location.pathname + '/update');
      $.post(window.location.pathname + '/update', { content: content })
    },
    
    mouseover: function() {
       $(this).addClass("hilite");
    },
    
    mouseout: function() {
      $(this).removeClass("hilite");
    }

  });

  $("#edit_submit").click(function() {
    //alert($('#content').val());
    var content = $('#content').val();
    $.post(window.location.pathname + 'update', { content: content });  
  
  });

});