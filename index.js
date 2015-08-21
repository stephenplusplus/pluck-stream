'use strict'

var arrify = require('arrify')
var async = require('async')
var concat = require('concat-stream')
var JSONStream = require('jsonstream')
var through = require('through2')

var pluck = module.exports = function (stream, properties, cb) {
  properties = arrify(properties)

  if (!cb) return stream.pipe(pluck.stream(properties))

  var hash = {}

  var pluckProperty = function (property, done) {
    stream
      .pipe(JSONStream.parse(property))
      .on('error', done)
      .pipe(concat(function (results) {
        hash[property] = results
        done(null, hash)
      }))
  }

  async.each(properties, pluckProperty, function (err) {
    if (err) return cb(err)
    cb(null, properties.length === 1 ? hash[properties[0]] : hash)
  })
}

pluck.stream = function () {
  var stream = through()

  var properties = [].slice.call(arguments).reduce(function (acc, arg) {
    acc = acc.concat(arrify(arg))
    return acc
  }, [])

  properties.forEach(function (property) {
    stream.pipe(JSONStream.parse(property))
      .on('error', stream.emit.bind(stream, 'error'))
      .on('data', stream.emit.bind(stream, property))
  })

  return stream
}
