require.paths.unshift(__dirname)
var cradle = require(__dirname+'/../vendor/').cradle,
  utils = require('crypto-utils'),
  EventEmitter = require('events').EventEmitter,
  config = require('config')
  
function EmailLookup(){
  var db = new cradle.Connection(config.dburl, 80).database('users')
  var emitter = new EventEmitter()
  this.isValid = function(email){
    db.get(utils.sha1(email), function(err, res){
      emitter.emit(!err?'registered':'unregistered', res)
    })
    return emitter
  }
}

exports.EmailLookup = EmailLookup
