
var Primus    = require('primus')
  , mqemitter = require('mqemitter')
  , mqstreams = require('mqstreams')
  , broker    = require('mqbroker')()
  , st        = require('st')
  , serveSt   = st(__dirname + "/static", {
        index: 'index.html'
      , cache: false
    })
  , server    = require('http').createServer(serveSt)
  , primus    = new Primus(server, { parser: 'JSON' })
  , port      = process.env.PORT || 3000

server.listen(port, function() {
  console.log('Primus Chat example listening on port', port)
})

primus.on('connection', function (spark) {
  // duplex stream!
  spark.pipe(broker.stream()).pipe(spark)
});

broker.on('subscribe', function(data) {
  broker.stream().end({ cmd: 'publish', topic: data.topic, payload: 'world' })
})
