var main = require('main-loop')
var EventEmitter = require('events').EventEmitter

var bus = new EventEmitter
var emit = bus.emit.bind(bus)
var state = {
  loading: false,
  counter: undefined
}
bus.on('plus', function () {
  if (state.loading) return
  state.loading = true
  loop.update(state)
  ws.write(JSON.stringify({ plus: 1 }) + '\n')
})

var through = require('through2')
var split = require('split2')

var wsock = require('websocket-stream')
var ws = wsock('ws://' + location.host)
ws.pipe(split(JSON.parse)).pipe(through.obj(write))

function write (row, enc, next) {
  state.counter = row.counter
  state.loading = false
  loop.update(state)
  next()
}

var render = require('./render.js').bind(null, emit)
var loop = main(state, render, require('virtual-dom'))
document.querySelector('#content').appendChild(loop.target)
