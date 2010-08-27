var port = process.env.PORT || 3000

require.paths.unshift(__dirname + '/lib/')
require.paths.unshift(__dirname + '/vendor/')
var vendor = require('./vendor')
var express = vendor.express,
    routes = require('routes'),
    connect = vendor.connect
    
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
// Routes


app.listen(port, function(){
  console.log('listening for connections on port ' + port)
});

