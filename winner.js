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

module.exports = declareWinner;
