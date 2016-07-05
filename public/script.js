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
			playerTwoChoice: ""
		}
	},

	componentDidMount() {
		socket.on('welcome', this.welcome);
		socket.on('gameOver', this.gameOver);
	},

	welcome(data) {
		this.setState({playerPosition: data.msg});
	},

	gameOver(data) {
		if (this.state.playerOneChoice==="") {
			this.setState({playerOneChoice:data.player1});
			if (this.state.playerTwoChoice===data.winner) {
				this.setState({result: "You are the winner!"});
			} else {
				this.setState({result: "You are the loser!"});
			}
		} else {
			this.setState({playerTwoChoice:data.player2});
			if (this.state.playerOneChoice===data.winner) {
				this.setState({result: "You are the winner!"});
			} else {
				this.setState({result: "Your are the loser!"});
			}
		}
	},

	handleChange(e, value) {
		if (this.state.playerPosition == "playerOne") {
			this.setState({playerOneChoice: e.target.value});
		} else {
			this.setState({playerTwoChoice: e.target.value})
		}
	},

	handlePlay(e) {
		socket.emit(
			'played',
			{
				player: this.state.playerPosition,
				playerOneChoice: this.state.playerOneChoice,
				playerTwoChoice: this.state.playerTwoChoice
			});
	},

	newGameGen() {
		this.setState({result: "", playerOneChoice: "", playerTwoChoice: ""});
		$('input[name="uplay"]').prop('checked', false);
	},

 	render() {

		var newGameButton = (this.state.result) ? <button onClick={this.newGameGen}>New Game</button> : "";

		return(
			<div>
				<h1>Messages: {this.state.playerPosition} </h1>
				<h1>Player One: {this.state.playerOneChoice || "Not played yet."}</h1>
				<h1>Player Two: {this.state.playerTwoChoice || "Not played yet."}</h1>
				<input type="radio" name="uplay" value="rock" onChange={this.handleChange}/>Rock <br />
				<input type="radio" name="uplay" value="paper" onChange={this.handleChange}/> Paper <br />
				<input type="radio" name="uplay" value="scissors" onChange={this.handleChange}/> Scissors <br />
				<button onClick={this.handlePlay}>Play</button>
				<h1>Result: {this.state.result}</h1>
				{newGameButton}
			</div>
		)
	}
})

ReactDOM.render(<Game />, document.getElementById('react-container'));
