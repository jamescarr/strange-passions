require.paths.unshift(__dirname + '/vendor/')

var sys = require('sys'),
    talks = new(require('talks').Talks),
    authentication = new(require('auth').EmailLookup)

    
exports.connect = function(app){
  app.get('/submitTalk', function(req, res){
    res.render('submit_talk.jade', {
      locals:{
        title:'What is Your Strange Passion?'
      }
    })
  })
  app.get('/vote/:slug', function(req,res){
   talks.vote(req.params.slug, function(err, result){
     res.redirect('/')  
   })
  })

  app.post('/submitTalk', submitTalk)

  app.post('/login', function(req, res){
    authentication.isValid(req.param('email'))
      .on('registered', function(){
        req.session.loggedIn = true
        redirectFromSession(req, res)
      })
      .on('unregistered', function(){
        res.render('login.jade', {locals:{
          message:Messages.UNREGISTERED
        }})
      })
  })
  
  app.get('/talk/:slug', function(req, res){
    talks.get(req.params.slug, function(err, result){
      res.render('talk.jade', {
        locals:{
          title: result.title,
          talk: result,
          talkBody: result.abstract.split('\n')
        }
      })
    })
  })

  app.get('/', function(req, res){
    talks.getAll(function(err, passions){
      talks.getVotes(function(err, votes){
        res.render('index.jade', {
            locals: {
                title: 'Strange Passions',
                info: req.flash('info'),
                talks: passions.map(function(doc){
                  var talk = doc.value
                  if(talk.abstract.length > 255)
                    talk.abstract = talk.abstract.substr(0, 255) + " ..."
                  var vote = votes.rows.filter(function(votes){ return votes.key == talk.slug})
                  talk.votes = vote.length > 0? vote[0].value : 0
                  return talk 
                  })
            }
        });
      })
    })
  });
}

var Messages = {
  NOT_LOGGED_IN:"Hold on there! We just need to make sure you're really attending the conference before continuing!",
  UNREGISTERED:"Sorry but it looks like that email is not registered."
}

var submitTalk = function(req, res){
    var talk = req.session.talk || {title:req.param('title'),
      abstract: req.param('abstract'),
      type:'talk',
      tags:req.param('tags').split(/\s/g)
    };
    if(req.session.loggedIn){
      talks.save(talk, function(err, result){
        req.session.talk = null
        req.flash('info', 'Your talk has been submitted')
        res.redirect('/')
      })
    }else{
      req.session.talk = talk
      req.session.onsuccess = submitTalk
      res.render('login.jade', {locals:{
        message:Messages.NOT_LOGGED_IN
      }})
    }
  }
function redirectFromSession(req, res){
  var next = req.session.onsuccess 
  req.session.onsuccess = null
  next(req, res)
}
