var split = require('split2')
var through = require('through2')
var pump = require('pump')
var endof = require('end-of-stream')
var path = require('path')

var ecstatic = require('ecstatic')
var st = ecstatic(path.join(__dirname, 'public'))

var http = require('http')
var server = http.createServer(st)
server.listen(8000)

var counter = 0
var streams = []

var wsock = require('websocket-stream')
wsock.createServer({ server: server }, function (stream) {
  var sp = split(JSON.parse)
  sp.on('error', function (err) { stream.end() })
  pump(stream, sp, through.obj(delay(500, write)))
  streams.push(stream)
 
  function write (row, enc, next) {
    if (!row || typeof row.plus !== 'number' || isNaN(row.plus)) return next()
    counter += row.plus
    var msg = JSON.stringify({ counter: counter })
    for (var i = 0; i < streams.length; i++) {
      streams[i].write(msg + '\n')
    }
    next()
  }
  function delay (ms, f) {
    return function () {
      var args = [].slice.call(arguments)
      setTimeout(function () { f.apply(null, args) }, ms)
    }
  }
  endof(stream, function () {
    var ix = streams.indexOf(stream)
    if (ix >= 0) streams.splice(ix, 1)
  })
  stream.write(JSON.stringify({ counter: counter }) + '\n')
})
