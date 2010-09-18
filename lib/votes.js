function Voter(talks){
  this.vote = function(req, res){
    var vote = {talk:req.param('talk'), rating: req.param('rating'), email:req.session.user.email}
    talks.vote(vote, function(){
      res.send({message:'Your vote has been cast'})
    })
  }
}

exports.Voter = Voter;
