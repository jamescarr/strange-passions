var Connection = require(__dirname+'/../vendor/').cradle.Connection,
    sha1 = require('crypto-utils').sha1,
    sys = require('sys'),
    config = require('config')

exports.Talks = function(db){
  var db = db || new Connection(config.dburl, 80, {cache:false}).database('strangepassions')
  
  this.get = function(key, cb){
    db.get(key, cb)
  }
  this.getAll = function(cb){
    db.view('talks/talks-with-votes', function(err, docs){
        if(!err){
          var talks = {}
          var theTalks = docs.filter(function(doc){
            if(doc.value.type == 'talk'){
              talks[doc.id] = doc
              doc.value.count = 0
              doc.value.sum = 0
            }else if(doc.value.type == 'vote'){
              talks[doc.key[0]].value.sum += doc.value.rating
              talks[doc.key[0]].value.count++        
            }
            return doc.value.type == 'talk'
          }).map(function(doc){
              doc.value.average = average(doc.value)
              return doc
          }).filter(function(doc){
            return doc.value.average > -1
          });
          
          var sortedTalks = theTalks.sort(function(a, b){
            return b.value.average - a.value.average 
          });
          cb(err, sortedTalks);
        }else{
          cb(err, docs)
        }

    })
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
  var average = function(doc){
   return Math.round((doc.sum / doc.count)*10)/10
  }
  this.getVotesForTalk = function(talk, cb){
    db.view('votes/count', {key:talk}, function(err, result){
      if(!err){
        var doc = result[0].value
        doc.average = average(doc)
        cb(err,{average: doc.average, count: doc.count});
      }else{
        cb(err, result);
      }
    });
  }
}


