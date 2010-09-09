require.paths.unshift(__dirname + '/vendor/')
var showdown = require('showdown').Showdown
var Messages = require('messages').Messages
var sys = require('sys'),
    talks = new(require('talks').Talks),
    SubmitTalks = require('submitTalk').SubmitTalks
    authentication = new(require('auth').EmailLookup)

var submitter = new SubmitTalks(talks)
    
exports.connect = function(app){
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
  app.get('/vote/:slug', function(req,res){
   talks.vote(req.params.slug, function(err, result){
     res.redirect('/')  
   })
  })
  app.post('/submitTalk', function(req, res){
    submitter.submit(req, res)
  })

  app.post('/login', function(req, res){
    authentication.isValid(req.param('email'))
      .on('registered', function(user){
        req.session.loggedIn = true
        req.session.user = user
        redirectFromSession(req, res)
      })
      .on('unregistered', function(){
        res.render('login.jade', {locals:{
          message:Messages.UNREGISTERED
        }})
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
        }
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
