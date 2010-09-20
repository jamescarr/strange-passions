var Connection = require(__dirname+'/../vendor/').cradle.Connection,
    sha1 = require('crypto-utils').sha1,
    sys = require('sys'),
    config = require('config')

exports.Talks = function(db){
  var db = db || new Connection(config.dburl, 80).database('strangepassions')
  
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
  this.getRating = function(talk, email, cb){
    db.get(email+talk, cb);
  }
  this.vote = function(vote, cb) {
    var key = vote.email + vote.talk;
    vote.type = 'vote';
    db.insert(key, vote, function(err, result){
      if(result.error && result.error == 'conflict'){
        db.get(key, function(err, result){
          db.save(key, result._rev, vote, cb);
        })
      }else{
        cb.apply(this, arguments);
      }
    })
    
  }
  this.getVotes = function(cb){
    db.view('talks/votes', {group:true}, cb)
  }
}


