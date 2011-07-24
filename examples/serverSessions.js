var http = require('http'),
    url  = require('url'),
    session = require('../lib/SessionHandler.js').SessionHandler;

var sessionHandler = new session();

var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true).query;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(sessionHandler.run(parsedUrl));
});

server.listen(5672, "127.0.0.1", function() {
  var address = server.address();
  console.log("opened server on %j", address);
});
