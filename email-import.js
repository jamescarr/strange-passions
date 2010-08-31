var request = require('request')
var Connection = require('cradle').Connection
var crypto = require('crypto')

var db = new Connection('sop.couchone.com', 80).database('users')

request({uri:'https://www.regonline.com/activereports/smartLink.aspx?eventid=0yJ+8WrS3pQ=&crid=501881'}, function(er, hdrs, body){
  body.replace(/"/g, "").split("\r\n").forEach(function(emailRecord){
    if(emailRecord.indexOf('@') > 0){
      var fields = emailRecord.split(',')
      var doc = {
        firstname: fields[0],
        lastname: fields[1],
        email: sha1(fields[2])
      }
      db.get(doc.email, function(err, result){
        if(err)
          db.insert(doc.email, doc, function(){ console.log("Added " + fields[2])})  
      })
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

