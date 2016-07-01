var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

var players = []

io.on('connection', socket => {
	var game = {};
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

	socket.on('played', packet => {
		if (socket === players[0]) {
			game.player1 = packet.gamePacket.player1;
			console.log(`Player 1 played ${game.player1}`);
			//players[1].emit('otherplayer',  {other: packet})
		} else if (socket === players[1]) {
			game.player2 = packet.gamePacket.player2;
			console.log(`Player 2 played ${game.player2}`);
			//players[0].emit('otherplayer', {other: packet})
		} else {
			console.error("I don't know what happened.")
		}
	})


	socket.on('disconnect', () => {
		console.log('a user disconnected.');
	});
});


http.listen(3000, () => {
	console.log('listening on port 3000...');
});
