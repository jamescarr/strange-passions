var sys = require('sys'),
    talks = new(require('talks').Talks)
    
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

  app.post('/submitTalk', function(req, res){
    talks.save({title:req.param('title'),
      abstract: req.param('abstract'),
      type:'talk',
      tags:req.param('tags').split(/\s/g)
    }, function(err, result){
      req.flash('info', 'Your talk has been submitted')
      res.redirect('/')
    })
   
  })

  app.get('/talk/:slug', function(req, res){
    talks.get(req.params.slug, function(err, result){
      res.render('talk.jade', {
        locals:{
          title: result.title,
          talk: result
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

