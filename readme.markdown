# virtual-dom-unidirectional-example

[virtual-dom](https://npmjs.com/package/virtual-dom) example
to demonstrate a unidirectional data flow from render function elements back out
through an EventEmitter

using [main-loop](https://npmjs.com/package/main-loop), websockets,
and [browserify](http://browserify.org)/[watchify](https://npmjs.com/package/watchify)
with [npm run scripts](http://substack.net/task_automation_with_npm_run)

# quick start

```
$ npm install
$ npm run watch &
$ npm start
```

# commands

* `npm run build` - build js for production
* `npm run watch` - automatically build js on file changes for development
* `npm start` - start a development server

# example code

## main browser code

``` js
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
```

## render function

``` js
var h = require('virtual-dom/h')

module.exports = function (emit, state) {
  var count = state.counter === undefined ? '...' : state.counter
  return h('div', [
    h('h1' + (state.loading ? '.loading' : ''), 'counter: ' + count),
    h('button', { onclick: onclick }, 'PLUS')
  ])
  function onclick () { emit('plus') }
}
```

# contributing

If you like what you see, but want to add something more, fork this repo and add
your additional feature to the name of the fork. Try to be specific with the
name of your fork, listing the technologies used plus what features the fork
adds.

# variations

Check out the [list of forks](https://github.com/substack/virtual-dom-starter/network/members)
to see how other people have customized this starter repo.

# license

This software is released into the public domain.
