var request = require('request')
var Connection = require('cradle').Connection
var crypto = require('crypto')

var db = new Connection().database('strangepassions')

request({uri:'https://www.regonline.com/activereports/smartLink.aspx?eventid=0yJ+8WrS3pQ=&crid=501887'}, function(er, hdrs, body){
  body.replace(/"/g, "").split("\r\n").forEach(function(email){
    if(email.indexOf('@') > 0){
      db.insert(sha1(email), {}, function(){ console.log("Added " + email)})  
    }
  })
})

function sha1(str){
  return crypto.createHash('sha1').update(str).digest('hex')
}
 /**
var client = http.createClient(443, 'www.regonline.com')

var req = client.request('GET', '/activereports/smartLink.aspx?eventid=0yJ+8WrS3pQ=&crid=501887', {'host': 'www.regonline.com'})

req.end()

req.on('error', function(err){
  console.log(err)
})
req.on('response', function(res){
  
  res.on('data', function(data){
    console.log(data)
  })
})



*/

