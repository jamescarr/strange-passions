#!/usr/local/bin/node
// generated by npm, please don't touch!
var dep = require('path').join(__dirname, "./../../../../../connect/0.2.4/dependencies")
var depMet = require.paths.indexOf(dep) !== -1
var from = "./../../../../../connect/0.2.4/package/lib/connect/middleware/errorHandler"

if (!depMet) require.paths.unshift(dep)
module.exports = require(from)

if (!depMet) {
  var i = require.paths.indexOf(dep)
  if (i !== -1) require.paths.splice(i, 1)
}
