var net = require('net');
var gameServer = net.createServer();

var players = [];

var firstPlayerResponse;
var secondPlayerResponse;


function declareWinner(first, second) {
	var gameObjects = {
		"rock" : {
			losesTo: "paper",
			beats: "scissors"
		},

		"paper":  {
			losesTo: "scissors",
			beats: "rock"
		},

		"scissors":  {
			losesTo: "rock",
			beats: "paper"
		}
}

	if (gameObjects[first].losesTo == second) {
		return second;
	} else if (gameObjects[first].beats == second) {
		return first;
	} else  {
		return "Tie game!";
	}
}

gameServer.on('connection', socket => {
	players.push(socket);
	if (players.length > 2) {
		socket.write("Too many players, sorry... Bye.");
	} else if (players.length == 2){
		socket.write("You are player two 'rock' for rock, 'paper' for paper 'scissors' for scissors.\n");
	} else {
		socket.write("You are player one, 'rock' for rock, 'paper' for paper, 'scissors' for scissors.\n");
	}
	socket.on('data', data => {
		if ((socket === players[0]) && (firstPlayerResponse == null)) {
			firstPlayerResponse = data.toString();
		} else if ((socket === players[1]) && (secondPlayerResponse == null)) {
			secondPlayerResponse = data.toString();
		} else {
			socket.write("Wait for the other player...");
		}
	})
});

setInterval(() => {
	if (firstPlayerResponse && secondPlayerResponse) {
		players.forEach(player => {
			player.write(`First Player: ${firstPlayerResponse}`)
			player.write(`Second Player: ${secondPlayerResponse}`)
			var result = declareWinner(
				firstPlayerResponse.trim(), 
				secondPlayerResponse.trim());
			if (result == firstPlayerResponse.trim()) {
				player.write("Player 1 Wins!!!\n");
			} else if (result == secondPlayerResponse.trim()) {
				player.write("Player 2 Wins!!!\n");
			} else {
				player.write("Tie Game!!!\n");
			}
			process.exit()
		});
	}
}, 250);



console.log("Game server listening on port 9000");

gameServer.listen(9000)
