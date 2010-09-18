$(function(){
  $('input[value="submit rating"]').hide()
  $(".voting-wrapper").stars({
    inputType:'select'
  })
  
  setTimeout(function(){
    $('.info').fadeOut(2000)
  }, 2000);
  
  $("#vote").stars({
    callback:function(type, ui, value){
      var url = $('#vote-widget').attr('action');
      $.post(url, {value: value}, function(data){
        alert(data);
      })
    }
  });
})

