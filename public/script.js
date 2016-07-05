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
		socket.on('gameOver', this.gameOver);
	},

	welcome(data) {
		this.setState({playerPosition: data.msg});
	},

	gameOver(data) {
		this.setState({result: data.winner});
		if (this.state.playerOneChoice==="") {
			this.setState({playerOneChoice:data.player1});
		} else {
			this.setState({playerTwoChoice:data.player2});
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

 	render() {
		return(
			<div>
				<h1>Messages: {this.state.playerPosition} </h1>
				<h1>Player One: {this.state.playerOneChoice || "Not played yet."}</h1>
				<h1>Player Two: {this.state.playerTwoChoice || "Not played yet."}</h1>
				<input type="radio" name="uplay" value="rock" onChange={this.handleChange}/> Rock <br />
				<input type="radio" name="uplay" value="paper" onChange={this.handleChange}/> Paper <br />
				<input type="radio" name="uplay" value="scissors" onChange={this.handleChange}/> Scissors <br />
				<button onClick={this.handlePlay}>Play</button>
				<h1>Result: {this.state.result}</h1>
			</div>
		)
	}
})

ReactDOM.render(<Game />, document.getElementById('react-container'));
