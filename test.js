'use strict'

var assert = require('assert')
var fs = require('fs')
var pkg = require('./package.json')

var pluck = require('./')

describe('pluck-stream', function () {
  it('should pluck a single property', function (done) {
    var rs = fs.createReadStream('./package.json')

    pluck(rs, 'version', function (err, version) {
      assert.ifError(err)
      assert.strictEqual(version, pkg.version)
      done()
    })
  })

  it('should pluck multiple properties', function (done) {
    var rs = fs.createReadStream('./package.json')

    pluck(rs, ['version', 'name'], function (err, results) {
      assert.ifError(err)
      assert.deepEqual(results, {
        name: pkg.name,
        version: pkg.version
      })
      done()
    })
  })

  it('should emit events without a callback', function (done) {
    var rs = fs.createReadStream('./package.json')

    pluck(rs, 'version')
      .on('version', function (version) {
        assert.strictEqual(version, pkg.version)
        done()
      })
  })

  it('should emit events', function (done) {
    var rs = fs.createReadStream('./package.json')

    var versionReceived = false
    var nameReceived = false

    rs.pipe(pluck.stream('version', 'name'))
      .on('version', function (version) {
        versionReceived = version === pkg.version
      })
      .on('name', function (name) {
        nameReceived = name === pkg.name
      })

    setTimeout(function () {
      assert.strictEqual(versionReceived, true)
      assert.strictEqual(nameReceived, true)
      done()
    }, 150)
  })
})
