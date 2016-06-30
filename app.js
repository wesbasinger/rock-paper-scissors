var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

var players = []

io.on('connection', socket => {
	console.log('a user connected.');
	if (players.length === 0) {
		players.push(socket);
		socket.emit("welcome", {msg:"You are player 1!!!"});
	} else if (players.length == 1) {
		players.push(socket);
		socket.emit("welcome", {msg:"You are player 2!!!"});
	} else {
		socket.emit("welcome", {msg: "You are not welcome."});
	}
	
	socket.on('disconnect', () => {
		console.log('a user disconnected.');
	});
});


http.listen(3000, () => {
	console.log('listening on port 3000...');
});
