function FakeRequest(provided){
  var params = provided || {}
  this.param = function(name, value){
    if(value)
      params[name] = arguments[value]
    return params[name]
  }
  this.flash = function(name, value){
    this.flashSet[name] = value
  }
  this.flashSet = {}
  this.session = {};
}

function RecordingResponse(){
  this.called = {}
  this.render = function(template, vars){
    this.called.render = [template, vars]
  }  
  this.redirect = function(page){
    this.called.redirect = [page]
  }
}

exports.Request = FakeRequest
exports.Response = RecordingResponse
exports.Talks = function(){
  this.called = {}
  this.save = function(talk, callback){
    this.called.save = [talk]
    process.nextTick(callback)
  }
}
