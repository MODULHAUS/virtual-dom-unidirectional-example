var main = require('main-loop')
var EventEmitter = require('events').EventEmitter

var bus = new EventEmitter
var emit = bus.emit.bind(bus)
var state = {
  loading: false,
  counter: undefined
}
bus.on('plus', function () {
  state.loading = true
  loop.update(state)
  ws.send(JSON.stringify({ plus: 1 }) + '\n')
})

var ws = new WebSocket('ws://' + location.host)
ws.binaryType = 'arraybuffer'
ws.addEventListener('message', function (ev) {
  try {
    var str = new TextDecoder('utf-8').decode(new DataView(ev.data))
    var msg = JSON.parse(str)
  }
  catch (err) { return console.error(err) }
  state.counter = msg.counter
  state.loading = false
  loop.update(state)
})

var render = require('./render.js').bind(null, emit)
var loop = main(state, render, require('virtual-dom'))
document.querySelector('#content').appendChild(loop.target)
