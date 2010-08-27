require.paths.unshift(__dirname)
var cradle = require(__dirname+'/../vendor/').cradle,
  utils = require('crypto-utils'),
  EventEmitter = require('events').EventEmitter
  
function EmailLookup(){
  var db = new cradle.Connection('sop.couchone.com', 80).database('strangepassions')
  var emitter = new EventEmitter()
  this.isValid = function(email){
    console.log('looking for ' + utils.sha1(email))
    db.get(utils.sha1(email), function(err, res){
      console.log(res)
      console.log("error: "+err)
      emitter.emit(!err?'registered':'unregistered')
    })
    return emitter
  }
}

exports.EmailLookup = EmailLookup
