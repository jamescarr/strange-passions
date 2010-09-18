var config = {
  db:{
    development:'sop-staging.couchone.com',
    production:'sop.couchone.com'
  }
}

exports.__defineGetter__('dburl', function(){
  return config.db.production
})
