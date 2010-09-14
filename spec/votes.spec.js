var vows = require('vows')
var assert = require('assert')
var Voter = require('votes').Voter
var fakes = require(__dirname+"/helpers/fake-request")

var talks = new fake.Talks()
vows.describe('Votes').addBatch({
  'Given a vote has been cast':{
    'when the voter has not voted yet':{
      topic:function(){
        var req = new fake.Request({talk:'lightsabers!', rating:3}
        req.session.user = {email:"EMAILHASH"}
        var res = new fake.Response()
        
        var voter = new Voter(talks)
        voter.vote(req, res)
        return {res:resp, talks:talks}
      },
      ''
    }
  }
}).export(module)
