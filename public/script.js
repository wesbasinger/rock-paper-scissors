var socket = io();
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var Game = React.createClass({
	getInitialState() {
		return {
			playerPosition: "",
			result: "",
			playerOneChoice: "",
			playerTwoChoice: "",
			message: "",
			wins: 0,
			losses: 0
		}
	},

	componentDidMount() {
		socket.on('welcome', this.welcome);
		socket.on('gameOver', this.gameOver);
		socket.on('status', this.handleStatus);
		socket.on('playerLeft', this.handlePlayerLeft);
		socket.on('notWelcome', this.notWelcome);
	},

	notWelcome(data) {
		this.setState({message: data.msg});
	},

	handlePlayerLeft(data) {
		this.setState({message: data.msg, playerPosition: "playerOne"});
	},

	handleStatus(data) {
		this.setState({message: data.msg});
	},

	welcome(data) {
		this.setState({playerPosition: data.msg});
	},

	gameOver(data) {
		if (this.state.playerOneChoice==="") {
			this.setState({playerOneChoice:data.player1});
			if (this.state.playerTwoChoice===data.winner) {
				this.setState({result: "You are the winner!", wins: this.state.wins + 1});
			} else {
				this.setState({result: "You are the loser!", losses: this.state.losses + 1});
			}
		} else {
			this.setState({playerTwoChoice:data.player2});
			if (this.state.playerOneChoice===data.winner) {
				this.setState({result: "You are the winner!", wins: this.state.wins + 1});
			} else {
				this.setState({result: "Your are the loser!", losses: this.state.losses + 1});
			}
		}
		this.setState({message: "Game over, click New Game!"});
	},

	handleChange(e, value) {
		if (this.state.playerPosition == "playerOne") {
			this.setState({playerOneChoice: e.target.value});
		} else {
			this.setState({playerTwoChoice: e.target.value})
		}
	},

	handlePlay(e) {
		this.setState({message: "Waiting on the other player..."});
		socket.emit(
			'played',
			{
				player: this.state.playerPosition,
				playerOneChoice: this.state.playerOneChoice,
				playerTwoChoice: this.state.playerTwoChoice
			}
		);
	},

	newGameGen() {
		this.setState(
			{
				result: "",
				playerOneChoice: "",
				playerTwoChoice: "",
				message: "New game has started."}
		);
		$('input[name="uplay"]').prop('checked', false);
	},

 	render() {

		var newGameButton = (this.state.result) ? <button onClick={this.newGameGen}>New Game</button> : "";

		return(
			<div>
				<h1>Messages: {this.state.message}</h1>
				<h1>You Are: {this.state.playerPosition} </h1>
				<h1>Player One: {this.state.playerOneChoice || "Not played yet."}</h1>
				<h1>Player Two: {this.state.playerTwoChoice || "Not played yet."}</h1>
				<input type="radio" name="uplay" value="rock" onChange={this.handleChange}/>Rock <br />
				<input type="radio" name="uplay" value="paper" onChange={this.handleChange}/> Paper <br />
				<input type="radio" name="uplay" value="scissors" onChange={this.handleChange}/> Scissors <br />
				<button onClick={this.handlePlay}>Play</button>
				<h1>Result: {this.state.result}</h1>
				{newGameButton}
				<h1>Scoreboard</h1>
				<table>
					<tr>
						<td>Wins</td>
						<td>Losses</td>
					</tr>
					<tr>
						<td>{this.state.wins}</td>
						<td>{this.state.losses}</td>
					</tr>
				</table>
			</div>
		)
	}
})

ReactDOM.render(<Game />, document.getElementById('react-container'));
