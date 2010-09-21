require.paths.unshift(__dirname + '/vendor/')
var showdown = require('showdown').Showdown
var Messages = require('messages').Messages
var sys = require('sys'),
    talks = new(require('talks').Talks),
    SubmitTalks = require('submitTalk').SubmitTalks,
    authentication = new(require('auth').EmailLookup)
var Voter = require ('votes').Voter


var submitter = new SubmitTalks(talks)
var voter = new Voter(talks);
   
exports.connect = function(app){
  app.get('/login', function(req, res){
    res.render('login.jade', {
      locals:{
        message: Messages.NOT_LOGGED_IN,
      },
      layout: false
    });
  });
  app.get('/submitTalk', function(req, res){
    res.render('submit_talk.jade', {
      locals:{
        title:'What is Your Strange Passion?'
      }
    })
  })
  app.get('/talks', function(req, res){
    talks.getAll(function(err, passions){
      talks.getVotes(function(err, votes){
        res.render('talks.jade', {
          locals: {
            title: 'Strange Passions',
            info: req.flash('info'),
            talks: passions.map(function(doc){
              var talk = doc.value
              if(talk.abstract.length > 255)
                talk.abstract = new showdown.converter().makeHtml(talk.abstract.substr(0, 255) + " ...")
              var vote = votes.rows.filter(function(votes){ return votes.key == talk.slug})
              talk.votes = vote.length > 0? vote[0].value : 0
              return talk 
              })
          }
        });
      });
    });
  });
  app.post('/vote', function(req,res){
    voter.vote(req, res);
  })
/*
  app.post('/submitTalk', function(req, res){
    submitter.submit(req, res)
  })
  */
  app.get('/rating/:talk', function(req, res){
    if(req.session.loggedIn){
      talks.getRating(req.params.talk, req.session.user.email, function(err, result){
        sendJson(res, {rating: result.rating? result.rating : 0});
      })
    }else{
      sendJson(res, {rating:0});
    }
  });

  app.post('/login', function(req, res){
    authentication.isValid(req.param('email'))
      .on('registered', function(user){
        req.session.loggedIn = true;
        req.session.user = user;
        (req.xhr?replyViaJson:redirectFromSession)(req, res)
      })
      .on('unregistered', function(){
        (!req.xhr?
          (function(message){
            res.render('login.jade', {locals:message})
          })
          :
          (function(message) {
            res.send(JSON.stringify(message), {'Content-Type':'application/json'});
          }))({loggedIn: false, message:Messages.UNREGISTERED});
      })
  })
  
  app.get('/talk/:slug', function(req, res){
    var converter = new showdown.converter();
    talks.get(req.params.slug, function(err, result){
      res.render('talk.jade', {
        locals:{
          title: result.title,
          talk: result,
          talkBody: converter.makeHtml(result.abstract),
          bio: converter.makeHtml(result.bio)
        },
        context:req.session
      })
    })
  })

  app.get('/', function(req, res){
        res.render('index.jade', {
            locals: {
                title: 'Strange Passions',
                info: req.flash('info'),
            }
        });
  });
}

function redirectFromSession(req, res){
  var next = req.session.onsuccess 
  next(req, res)
  req.session.onsuccess = null
}

function sendJson(res, obj){
  res.send(JSON.stringify(obj), {'Content-Type':'application/json'});
}
function replyViaJson (req, res) {
  res.send(JSON.stringify({loggedIn:true}), {'Content-Type':'application/json'});
}
