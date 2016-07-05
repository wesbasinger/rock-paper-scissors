var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var winner = require('./winner');

app.use(express.static('public'))

app.set('port', process.env.PORT || 3000);

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
		socket.emit("welcome", {msg:"playerOne"});
	} else if (players.length == 1) {
		players.push(socket);
		socket.emit("welcome", {msg:"playerTwo"});
	} else {
		socket.emit("welcome", {msg: "You are not welcome."});
		socket.destroy();
	}

	socket.on('played', packet => {
		if (socket === players[0]) {
			game.player1 = packet.playerOneChoice;
			playedCount ++;
		} else if (socket === players[1]) {
			game.player2 = packet.playerTwoChoice;
			playedCount ++;
		} else {
			console.error("I don't know what happened.")
		}
		if (playedCount === 2) {
			playedCount = 0;
			var champ = winner(game.player1, game.player2);
			players.forEach(player => {
				player.emit('gameOver', {winner:champ, player1:game.player1, player2:game.player2});
			});
		}
	});

	// socket.on('newGame', () => {
	// 	if (playedCount != 0) {
	// 		playedCount = 0;
	// 	}
	// 	if (game != {}) {
	// 		game = {};
	// 	}
	// });


	socket.on('disconnect', () => {
		players.splice(players.indexOf(socket), 1);
		console.log('a user disconnected.');
	});
});


http.listen(app.get('port'), () => {
	console.log('listening on port ' + app.get('port') + "...");
});
