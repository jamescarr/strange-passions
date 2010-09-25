$(function(){
  $('input[value="submit rating"]').hide()
  $(".voting-wrapper").stars({
    inputType:'select'
  })
  
  setTimeout(function(){
    $('.info').fadeOut(2000)
  }, 2000);
  
  $("#vote").stars({
    cancelShow:false,
    captionEl:$('#rating-cap'),
    callback:function(type, ui, value){
      submitVote()
    }
  });
  
  $("#overall-rating").stars({
    cancelShow:false,
    captionEl:$('#overall-caption'),
    disabled:true

  });

  
  if(isTalkPage()){
    $.get('/rating/'+val('talk'), function(result){
      $("#vote").stars('select', result.rating);
    });
    updateOverallVotes();
  }
})

function updateOverallVotes(){
    $.get('/overall-rating/'+val('talk'),  function(stats){
      $('#overall-rating').stars('select', Math.round(stats.average));
      $('#overall-caption').text(stats.average + " ("+stats.count+" votes)");
    });
}
function isTalkPage(){
  return window.location.href.indexOf('/talk/') > -1
}
function val(name) {
  return $('input[name='+name+']').val();
}

function submitVote() {
  $.post('/vote', {talk:val('talk'), rating:val('rating')}, function(result){
    (result.mustLogin? processLogin:displayVoteSubmitted)();
  })
}
function processLogin(){
  $.get('/login',  function(data){
    var login = $(data)
    login.dialog({
     open:function(event, ui) {
       $('#login form').submit(function() {
         $.post('/login', {email:$('#email').val()},function(response) {
           if(response.loggedIn){
             $('#login').dialog('close');
             $('#login').dialog('destroy');
             submitVote();
           }else{
             $('#login p').text(response.message);
           }
         })
       return false;
       })
     }
    });
  });
}


function displayVoteSubmitted(){
  $('body').append('<p class="info">Your vote has been submitted</p>');
  updateOverallVotes();
  setTimeout(function(){
    $('.info').fadeOut(2000, function(){ $('.info').remove(); });
  }, 2000);
}
