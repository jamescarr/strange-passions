var Connection = require('cradle').Connection,
    sha1 = require('crypto-utils').sha1,
    sys = require('sys')

exports.Talks = function(db){
  var db = db || new Connection('sop.couchone.com', 5984).database('strangepassions')
  
  this.get = function(key, cb){
    db.get(key, cb)
  }
  this.getAll = function(cb){
    db.view('talks/all', cb)
  }
  this.save = function(talk, cb){
    talk.slug = talk.title.replace(/\W/g, "_")
    db.insert(talk.slug, talk, cb)
  }
  this.vote = function(slug, cb){
    db.insert({type:'vote', talk:slug}, cb)
  }
  this.getVotes = function(cb){
    db.view('talks/votes', {group:true}, cb)
  }
}


