var socket = io('http://rowshambo.herokuapp.com');
var gamePacket = {};

socket.on('welcome', msg => {
	$('#messages').text(msg.msg);
});
var radios = document.getElementsByName('uplay');
for (radio in radios) {
	radios[radio].onclick = function() {
		if ($('#messages').text() == "You are player 1!!!") {
			$('#p1').text(this.value);
			gamePacket.player1 = this.value;
		} else if ($('#messages').text() == "You are player 2!!!") {
			$('#p2').text(this.value);
			gamePacket.player2 = this.value;
		}
		socket.emit('played', {gamePacket:gamePacket});
	}
}
socket.on('gameOver', data => {
	console.log(data.msg);
	if (data.msg === "Tie Game!") {
		$('#result').text("Tie Game!!!");
		if ($('#p1').text() === "") {
			$('#p1').text(data.game.player1);
		} else {
			$('#p2').text(data.game.player2);
		}
	} else {
		if ($('#p1').text() === "") { // I must be player 2 then
			$('#p1').text(data.game.player1);
			if ($('#p2').text() === data.msg) {
				$('#result').text("You win!!!");
			} else {
				$('#result').text("You lose!!!");
			}
		} else if ($('#p2').text() === "") { // I must be player 1 then
			$('#p2').text(data.game.player2);
			if ($('#p1').text() === data.msg) {
				$('#result').text("You win!!!");
			} else {
				$('#result').text("You lose!!!");
			}
		} else {
			console.error("Something bad happened...")
		}

	}

});
