require.paths.unshift(__dirname+'/lib/')

var Talks = require('talks').Talks

var talks = new Talks();

for(var i =0; i < 100; i++){
  talks.save({
    title:"Talk number " + i,
    abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce iaculis molestie tellus vel rutrum. Mauris eget scelerisque metus. Maecenas nec turpis est. Aliquam id lacinia felis. Nunc at metus sed ipsum porta volutpat. Aenean ipsum eros, vehicula ac laoreet tempus, tempus viverra massa. Sed eu quam nisl. Integer hendrerit, metus sit amet facilisis placerat, eros augue molestie nisi, ac volutpat sapien arcu quis massa. Praesent id faucibus massa. Duis lobortis, eros ac porta hendrerit, nulla nunc ultrices justo, vitae elementum est risus et augue.\
\
Maecenas id eleifend mi. Nam in urna quam. Nullam vestibulum ligula sit amet mauris dignissim in bibendum quam blandit. Suspendisse potenti. Donec tellus odio, pharetra non rhoncus eget, aliquam quis risus. In tempor luctus enim, sit amet faucibus nisi ultrices in. Donec nisl eros, blandit in sodales nec, pellentesque a mi. Donec rhoncus varius massa, ut dictum velit tempor ac. Aenean eleifend dignissim pharetra. Nunc ut nibh eget dui laoreet consequat. Donec venenatis sagittis convallis. In nec arcu lorem. Nullam eget lorem orci, a lobortis est.\
\
Pellentesque porttitor, diam et fringilla facilisis, felis elit feugiat velit, a adipiscing magna ligula eget dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam malesuada feugiat nulla, nec blandit nunc auctor quis. Integer nec metus eget nisi lobortis eleifend. Aliquam dui justo, dictum ut pulvinar vel, lacinia sit amet justo. Donec sollicitudin porta nulla id cursus. Cras pulvinar leo et sem ullamcorper vestibulum. Ut ut ante eget magna imperdiet vehicula in a felis. Morbi purus nibh, tristique at cursus ac, suscipit sit amet massa. Etiam pellentesque consectetur urna, quis pulvinar tellus fringilla accumsan. Nulla sagittis tristique imperdiet. Donec at urna malesuada libero euismod posuere et sed nisi. Phasellus hendrerit sem nec ligula blandit luctus tristique sapien pellentesque. Nul",
    type:'talk',
    tags:["one", "two", "three"]
  }, function(err, res){ console.log(err); console.log(res);})
}

for(var i = 0; i < 1000; i++){
  for(var j =0; j < Math.random()*100; j++){
    talks.vote("Talk_number_"+i, function(err, res){ console.log(err); console.log(res);})
  }
}
