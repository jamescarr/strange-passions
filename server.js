var http = require('http'),
    spawn = require('child_process').spawn

http.createServer(function(req, res){
  var ls =spawn('ls -lAf ./vendor") 
  ls.stdout.on('data', function(data){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(data);
  })
  ls.stderr.on('data', function(data){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(data);
  })
}).listen(parseInt(process.env.PORT))
/*
require.paths.unshift(__dirname + '/lib/')
require.paths.unshift(__dirname + '/vendor/')
require(__dirname + '/vendor')
var express = require('express'),
    routes = require('routes'),
    connect = require('connect')
    
var app = express.createServer(
  connect.bodyDecoder(),
  connect.methodOverride(),
  connect.cookieDecoder(),
  connect.session()
  ); 

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use('/', connect.compiler({ src: __dirname + '/public', enable: ['sass'] }));
    app.use('/', connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.set('reload views', 1000);
    app.use('/', connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use('/', connect.errorHandler()); 
});

routes.connect(app);


app.listen(parseInt(process.env.PORT) || 3000, null);


*/
