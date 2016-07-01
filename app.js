var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var winner = require('./winner');

app.use(express.static('public'))

var port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

var players = []
var playedCount = 0;

var game = {};

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
		socket.destroy();
	}

	socket.on('played', packet => {
		if (socket === players[0]) {
			game.player1 = packet.gamePacket.player1;
			playedCount ++;
			//players[1].emit('otherplayer',  {other: packet})
		} else if (socket === players[1]) {
			game.player2 = packet.gamePacket.player2;
			playedCount ++;
			//players[0].emit('otherplayer', {other: packet})
		} else {
			console.error("I don't know what happened.")
		}
		if (playedCount === 2) {
			var champ = winner(game.player1, game.player2);
			players.forEach(player => {
				player.emit('gameOver', {msg:champ, game:game});
			});
			players = [];
			playedCount = 0;
			game = {};
		}
	});


	socket.on('disconnect', () => {
		players.splice(players.indexOf(socket), 1);
		console.log('a user disconnected.');
	});
});


http.listen(port, () => {
	console.log(`listening on port ${port}`);
});
