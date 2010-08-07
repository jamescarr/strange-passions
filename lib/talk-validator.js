exports.validate = function(talk, cb){
  var err = {};
  ['title', 'abstract'].forEach(function(field){
    if(!talk[field]) err[field] = capitalize(field) + " is required"
  })

  cb(Object.keys(err).length > 0? err:null, talk)
}

function capitalize(str){
  return str.substr(0,1).toUpperCase() + str.substr(1)
}
