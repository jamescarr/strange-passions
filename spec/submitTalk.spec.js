require.paths.unshift(__dirname+"/helpers")
require.paths.unshift(__dirname+"/../lib/")
var vows = require('vows')
var assert= require('assert')
var submit = require('submitTalk')
var fakes = require('fake-request')
var Messages = require('messages').Messages

var talk = Object.freeze({
    title:'Awesome',
    tags:'one two three',
    bio:'An awesome dude',
    abstract:'what it is like to be awesome'
})
vows.describe('submitTalk').addBatch({
  'Given the user is not logged in':{
    'When all fields are filled out':{
      topic:talkIsSubmitted({
          title:'Awesome',
          tags:'one two three',
          bio:'An awesome dude',
          abstract:'what it is like to be awesome'
        }), 
      'it should store the talk on the session':function(params){
        var talk = params.req.session.talk
        assert.deepEqual({
          title:'Awesome',
          tags:['one', 'two', 'three'],
          bio:'An awesome dude',
          abstract:'what it is like to be awesome',
          type:'talk'
        }, talk);
      },
      'it should set the submit talk function as on success':function(params){
        var session = params.req.session
        assert.deepEqual(session.onsuccess, params.submitter.submit) 
      },
      'it should render the login page':renders('login.jade', {message:Messages.NOT_LOGGED_IN}),
      'it should not save the talk':function(params){
        var talks = params.talks
        
        assert.isUndefined(talks.called.save)
      }
    },
    'When tags are empty':{
      topic: talkIsSubmitted({
        title:'Awesome',
        tags:'',
        bio:'An awesome dude',
        abstract:'what it is like to be awesome'
      }),
      'it should still store it on the session':function(params){
        var talk = params.req.session.talk
        assert.deepEqual({
          title:'Awesome',
          tags:[''],
          bio:'An awesome dude',
          abstract:'what it is like to be awesome',
          type:'talk'
        }, talk);
      }
    }
  },
  'Given the user is logged in':{
    'when a talk is submitted':{
      topic: talkIsSubmitted(talk, true),
      'it should save the talk':talkIsSaved(), 
      'it should redirect to index with message':redirectsTo('/', {info:'Your talk has been submitted'})
    },
    'when a talk is in the session':{
      topic:talkIsInSession(talk, true),
      'it should save the talk':talkIsSaved(),
      'it should redirect to index with message':redirectsTo('/', {info:'Your talk has been submitted'}),
      'it should remove the talk from the session':function(params){
        var session = params.req.session
        
        assert.isNull(session.talk)
      }
    }
  }
}).export(module)

function redirectsTo(page, flash){
  return function(params){
    var res = params.res
    var req = params.req
    
    assert.equal(page, res.called.redirect[0])
    assert.deepEqual(req.flashSet, flash)
  }
}

function expectedTalk(talk, speakerName){
  var expectedTalk = clone(talk)
  expectedTalk.type = 'talk'
  expectedTalk.tags = talk.tags.split(/\s/g)
  expectedTalk.speaker = speakerName
  return expectedTalk
}

function talkIsSaved(){
  return function(params){
    var talks = params.talks

    assert.deepEqual(expectedTalk(talk, 'James Carr'), talks.called.save[0])
  }
}
function renders(page, locals){
  return function(params){
    var res = params.res
    assert.deepEqual(res.called.render, [page, {locals:locals}])
  }
}

function talkIsInSession(talk, loggedIn){
  return function(){
    var req = new fakes.Request()
    var res = new fakes.Response()
    var talks = new fakes.Talks()
    req.session.talk = expectedTalk(talk)
    
    if(loggedIn){
      req.session.user = {'firstname':'James', 'lastname':'Carr'}
      req.session.loggedIn = loggedIn
    }
    var submitter = new submit.SubmitTalks(talks)
    submitter.submit(req, res)
    return {req:req, 'res':res, 'talks':talks, 'submitter':submitter}
    }
}
function talkIsSubmitted(talk, loggedIn){
  return function(){
    var req = new fakes.Request(talk)
    var res = new fakes.Response()
    var talks = new fakes.Talks()
    
    if(loggedIn){
      req.session.user = {'firstname':'James', 'lastname':'Carr'}
      req.session.loggedIn = loggedIn
    }
    var submitter = new submit.SubmitTalks(talks)
    submitter.submit(req, res)
    return {req:req, 'res':res, 'talks':talks, 'submitter':submitter}
    }
}

function clone(obj){
  var clonedObj = {}
  Object.getOwnPropertyNames(obj).forEach(function(name){
    clonedObj[name] = obj[name]
  })
  return clonedObj
}
