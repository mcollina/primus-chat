
var Primus    = require('primus')
  , broker    = require('mqbroker')()
  , send      = require('send')
  , url       = require('url')
  , serveSt   = function (req, res) {

      // your custom error-handling logic:
      function error(err) {
        res.statusCode = err.status || 500;
        res.end(err.message);
      }

      // your custom directory handling logic:
      function redirect() {
        res.statusCode = 301;
        res.setHeader('Location', req.url + '/');
        res.end('Redirecting to ' + req.url + '/');
      }

      // transfer arbitrary files from within
      // static/*
      send(req, url.parse(req.url).pathname, {root: 'static'})
        .on('error', error)
        .on('directory', redirect)
        .pipe(res);
    }
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
