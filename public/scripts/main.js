$(function(){
  $('input[value="submit rating"]').hide()
  $(".voting-wrapper").stars({
    inputType:'select'
  })
  
  setTimeout(function(){
    $('.info').fadeOut(2000)
  }, 2000)
})

