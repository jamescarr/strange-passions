require.paths.unshift(__dirname+'/../lib/');
var vows = require('vows');
var assert = require('assert');
var Talks  = require('talks').Talks;
var cradle = require('cradle');

var db = new cradle.Connection('donejs.couchone.com',80).database('strangepassions');

var talks = new Talks(db);

vows.describe('talks').addBatch({
  'vote totals':{
    topic:function(){
      talks.getVotesForTalk('A_Brief_Tour_of_Replicant_Architecture', this.callback);
    },
    'should include average':function(err, result){
      assert.equal(result.average, 3.3);
    },
    'should include total votes': function(err, result){
      assert.equal(result.count, 23);
    }
  }

}).export(module);
