var h = require('virtual-dom/h')

module.exports = function (emit, state) {
  var count = state.counter === undefined ? '...' : state.counter
  return h('div', [
    h('h1' + (state.loading ? '.loading' : ''), 'counter: ' + count),
    h('button', { onclick: onclick }, 'PLUS')
  ])
  function onclick () { emit('plus') }
}
