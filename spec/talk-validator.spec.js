require.paths.unshift(__dirname+'/../lib/')

var vows = require('vows'),
    assert = require('assert'),
    validator = require('talk-validator')
    
vows.describe('Talk Validator').addBatch({
  'When all fields are missing':{
    topic: function(){
      validator.validate({}, this.callback)
    },
    'should have message "x is required"':function(err, result){
      assert.equal(err.title, "Title is required")
    },
    'should have message "Abstract is required"':function(err, result){
      assert.equal(err.abstract, "Abstract is required")
    }
  },
  'When there are no errors':{
    topic:function(){
      validator.validate({title:"howdy", abstract:"hehehe"}, this.callback)
    },
    'err should be null':function(err, result){
      assert.isNull(err)
    },
    'should pass the talk back through result':function(err, result){
      assert.deepEqual({title:'howdy', abstract:'hehehe'}, result)
    }
  }
}).export(module)
