var express = require('express');
var dj = require('../../d');
var nowjs = require('now');

server = express.createServer();

var everyone = nowjs.initialize(server, {socketio:{"log level": process.argv[2]}});

dj.initialize(server, nowjs, everyone);

server.set('view options', {
	layout: false
});

server.set('view engine', 'ejs');

// Configuration
server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
server.set('views', __dirname + '/views');
server.use(express.static(__dirname + '/static'));



server.get('/', function (req, res){
	res.render("splash");
});

server.get('/admin', function (req, res) {
	res.render("porntable");
})

server.listen(80);
console.log("Express server listening on port %d", server.address().port);
