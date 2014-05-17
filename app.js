
var Primus      = require('primus')
  , ready       = require('domready')
  , fs          = require('fs')
  , hyperspace  = require('hyperspace')
  , msgHtml

// on a separate line or brfs will fail
msgHtml = fs.readFileSync(__dirname + '/static/message.html', 'utf8')

function buildUpdateStream() {
  return hyperspace(msgHtml, function (row) {
    return {
        '.topic': row.topic
      , '.payload': row.payload
    };
  });
}

function setupSubcribe(primus) {
  var updates = buildUpdateStream().appendTo('#messages')

  primus.write({
      cmd: 'subscribe'
    , topic: 'hello'
  })

  primus.on('data', function(msg) {
    updates.write(msg)
  })
}

function setupForm(primus) {
  var form = document.querySelector("#send")

  form.onsubmit = function() {
    var message = form.querySelector("input")
    primus.write({
        cmd: 'publish'
      , topic: 'hello'
      , payload: message.value
    })
    return false
  }
}

ready(function() {
  var primus  = new Primus()

  setupSubcribe(primus)
  setupForm(primus)
})
