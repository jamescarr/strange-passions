var Connection = require('cradle').Connection

var db = new Connection().database('strangepassions')

db.destroy();
db.create();

db.insert('_design/talks', {
   "all": {
       "map": "function (doc){ if(doc.type=='talk')emit(doc.slug, doc);    }"
   },
   "votes": {
       "map": "function(doc){ if(doc.type=='vote')emit(doc.talk, 1); }",
       "reduce": "_sum"
   }
})
