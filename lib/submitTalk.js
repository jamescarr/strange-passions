var Messages = require('messages').Messages

exports.SubmitTalks = function(talks){
  this.submit = function(req, res){
    var talk = (req.session.talk?fromSession:fromRequest)(req);
    (req.session.loggedIn?storeAndForward:storeAndRequestLogin).call(this, talk, req, res);
  }
  function storeAndRequestLogin(talk, req, res){
    req.session.talk = talk
    req.session.onsuccess = this.submit
    res.render('login.jade', {locals:{message:Messages.NOT_LOGGED_IN}})
  }
  function storeAndForward(talk, req, res){
    talk.speaker = getSpeakerName(req.session.user)
    talks.save(talk, function(){
      req.session.talk = null
      req.flash('info', 'Your talk has been submitted')
      res.redirect('/')
    })
  }
  function fromRequest(req){
    return {title: req.param('title'),
        tags: req.param('tags').split(/\s/g),
        bio: req.param('bio'),
        abstract: req.param('abstract'),
        type:'talk'
      }
  }
  function fromSession(req){
    return req.session.talk
  }  
  function getSpeakerName(user){
    return user.firstname + " " + user.lastname;
  }  
}

