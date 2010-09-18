require.paths.unshift(__dirname+"/../lib")
var vows = require('vows')
var assert = require('assert')
var Voter = require('votes').Voter
var fake = require(__dirname+"/helpers/fake-request")

var talks = new fake.Talks()
vows.describe('Votes').addBatch({
  'Given a vote has been cast':{
    'when the voter has not voted yet':{
      topic:function(){
        var req = new fake.Request({talk:'lightsabers!', rating:3})
        req.session.user = {email:"EMAILHASH"}
        var res = new fake.Response()
        
        var voter = new Voter(talks)
        voter.vote(req, res)
        return {res:res, talks:talks}
      },
      'it should save a document of the talk':function(interactions){
        var talks = interactions.talks;
        
        assert.deepEqual(talks.called.vote[0], {talk:'lightsabers!', rating:3, email:'EMAILHASH'})
      },
      'should render message indicating that vote was cast':function(interaction){
        var res = interaction.res
        
        assert.deepEqual(res.called.send[0], {message:'Your vote has been cast'});
      }
    }
  }
}).export(module)
