var socket = io();
var React = require('react');
var ReactDOM = require('react-dom');

var Game = React.createClass({
	getInitialState() {
		return {
			playerPosition: "",
			result: "",
			playerOneChoice: "",
			playerTwoChoice: ""
		}
	},

	componentDidMount() {
		socket.on('welcome', this.welcome);
	},

	welcome(data) {
		this.setState({playerPosition: data.msg});
	},

	handleChange(e, value) {
		if (this.state.playerPosition == "playerOne") {
			this.setState({playerOneChoice: e.target.value});
		} else {
			this.setState({playerTwoChoice: e.target.value})
		}
		socket.emit(
			'played',
			{
				player: this.state.playerPosition,
				playerOneChoice: this.state.playerOneChoice,
				playerTwoChoice: this.state.playerTwoChoice
			})
	},

 	render() {
		return(
			<div>
				<h1>Messages: {this.state.playerPosition} </h1>
				<h1>Player One: {this.state.playerOneChoice}</h1>
				<h1>Player Two: {this.state.playerTwoChoice}</h1>
				<input
					type="radio"
					name="uplay"
					value="rock"
					onChange={this.handleChange}/> Rock <br />
				<input
					type="radio"
					name="uplay"
					value="paper"
					onChange={this.handleChange}/> Paper <br />
				<input
					type="radio"
					name="uplay"
					value="scissors"
					onChange={this.handleChange}/> Scissors <br />
				<h1>Result: Result goes here...</h1>
			</div>
		)
	}
})

ReactDOM.render(<Game />, document.getElementById('react-container'));

/* OLD SCRIPT
var gamePacket = {};

socket.on('welcome', msg => {
	$('#messages').text(msg.msg);
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
});



socket.on('gameOver', data => {
	var newButton = $('<button id="startgame"></button').text("Start New Game");
	$('#newgame').append(newButton);
	$('#startgame').click(() => {
		$('#p1').text("");
		$('#p2').text("");
		$('#result').text("");
		$('input[name="uplay"]').prop('checked', false);
		$('#startgame').remove();
		socket.emit('newGame', {});
	});
	if (data.msg === "Tie game!") {
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
*/
