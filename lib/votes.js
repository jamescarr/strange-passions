function Voter(talks){
  this.vote = function(req, res){
    if(req.session.user){
      var vote = {talk:req.param('talk'), rating: req.param('rating'), email:req.session.user.email}
      talks.vote(vote, function(){
        res.send(JSON.stringify({message:'Your vote has been cast'}))
      })
    }else{
      res.send(JSON.stringify({mustLogin:true}), {'Content-Type':'application/json'});
    }
  }
}
exports.Voter = Voter;
