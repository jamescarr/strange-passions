var Connection = require('cradle').Connection,
    fs = require('fs'),
    sys = require('sys')

var DESIGN_DOCS_DIR = __dirname + '/designdocs/'

var db = new Connection('sop-staging.couchone.com', 80).database('strangepassions')

db.exists(function(err, result){
  if(!result){
    db.create();
  }
  fs.readdir(DESIGN_DOCS_DIR, function(err, files){
    files.forEach(function(fileName){
      fs.readFile(DESIGN_DOCS_DIR+fileName, function(err, data){
        var designDocName = '_design/'+fileName.replace(/\.json$/, '')
        db.get(designDocName, function(err, doc){
          db[doc.error?'insert':'save'](designDocName, JSON.parse(data), function(err, res){
            sys.puts('[DB] ' + res)
          })
        })
      })
    })
  })
})
