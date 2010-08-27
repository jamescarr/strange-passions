var crypto = require('crypto')

function sha1(title){
  return crypto.createHash('sha1').update(title).digest('hex')
}

exports.sha1 = sha1
