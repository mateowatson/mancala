var manBoard = {
	template: `
		<div class="mancala__board">
			<h2 class="sr-only">Board</h2>
			

			<div class="mancala__turn">
				<p>Turn: {{ turn }}</p>
			</div>
			
			<div class="mancala__holes-wrapper">
				<div class="mancala__holes">
					<div class="mancala__hole" v-for="(hole, index) in holes" :class="hole.cssClasses">
						<canvas :class="'mancala__grass-canvas mancala__grass-canvas_' + hole.number" v-if="hole.number === 7 || hole.number === 14" width="103" height="205"></canvas>
						
						<div class="mancala__stones" @click="playTurn(hole, index)">
							<div class="mancala__stone" v-for="stone in hole.stones"></div>
							<div class="mancala__stones-count">{{ hole.stones }}</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="mancala__winner-notification" v-show="winner">
				<h3 class="mancala__winner-heading">{{ winnerHeading }}</h3>

				<div class="mancala__winner-options">
					<button class="btn mancala__btn mancala__btn_primary" @click="reset">Play Again!</button>
					<a href="/" class="btn mancala__btn">Go Back to the Home Screen</a>
				</div>
			</div>

			<div class="mancala__instructions">
				<h2>Welcome to Mancala, a tradition from the dawn of time</h2>

				<p>Mancala, from the Arabic <em>naqala</em> (نقلة), meaning “to move,” is a game believed to have originated in Africa thousands of years ago. Some versions, like the one on this page, use seeds as game pieces. Join a friend or neighbor and enjoy this relaxing, seed-sorting competition. Here are the rules.</p>

				<ol>
					<li>Each player has six holes of dirt. Player 1 is the bottom row, and Player 2 is the top row;</li>
					<li>Each player will capture seeds and place them in a pile on their own grassy area, known as their mancala. Player 1’s mancala is on the right; Player 2’s is on the left.</li>
					<li>On your turn, pick up all the seeds of one of your holes (click it) and place one seed in each hole going counter-clockwise, skipping over your opponent’s mancala. If a seed drops in your mancala, you have captured that seed.</li>
					<li>If the last seed you drop lands in your mancala, you get to go again.</li>
					<li>If the last seed you drop lands in an empty hole on your side of the board, you capture that seed and all the seeds in your opponent’s hole directly opposite.</li>
					<li>If you still have seeds on your side of the board when the game ends, you capture all those seeds.</li>
					<li>The player with the most seeds in their mancala wins.</li>
				</ol>
			</div>
		</div>
	`,

	data: function() {
		return {
			holes: [],
			winner: '',
			winnerHeading: '',
			turn: 'Player 1',
			players: {
				player1: {
					points: 0
				},

				player2: {
					points: 0
				}
			},
			opposingHolePairs: [
				{ 0: 12 }, { 12: 0 },
				{ 1: 11 }, { 11: 1 },
				{ 2: 10 }, { 10: 2 },
				{ 3: 9 }, { 9: 3 },
				{ 4: 8 }, { 8: 4 },
				{ 5: 7 }, { 7: 5 }
			]
		}
	},

	methods: {
		makeHoles: function() {
			for (var i = 0; i < 14; i++) {
				var hole = {};
				hole.number = i + 1;

				if (hole.number !== 7 && hole.number !== 14) {
					hole.stones = 4;
					hole.type = 'pit';
					hole.cssClasses = 'mancala__hole mancala__hole_pit';
				} else {
					hole.stones = 0;
					hole.type = 'store';
					hole.cssClasses = 'mancala__hole mancala__hole_store';
				}

				this.holes.push(hole);
			}
		},

		playTurn: function(hole, index) {
			if (this.turn === 'Player 1' && index <= 5) {
				return;
			}

			if (this.turn === 'Player 2' && index >= 7) {
				return;
			}

			if (hole.number !== 7 && hole.number !== 14) {
				var stonesCounter = hole.stones;
				var holeCounter = hole.number; // is already holes[i + 1]

				hole.stones = 0;

				for (var i = 0; i < stonesCounter; i++) {
					var holeEl = this.holes[holeCounter];

					if (!holeEl) {
						holeCounter = 0;
						holeEl = this.holes[holeCounter];
					}

					if (
						(holeEl.type === 'pit') ||
						(holeEl.number === 7 && this.turn === 'Player 2') ||
						(holeEl.number === 14 && this.turn === 'Player 1')
					) {
						if (
							(i === stonesCounter - 1 && holeEl.stones === 0 && holeEl.number - 1 < 6 && this.turn === 'Player 2') ||
							(i === stonesCounter - 1 && holeEl.stones === 0 && holeEl.number - 1 > 6 && holeEl.number - 1 < 13 && this.turn === 'Player 1')
							) {
							var isEmptyHole = true;
						}
						holeEl.stones++;

						if (isEmptyHole) {
							this.checkOpposingHoleCondition(holeEl);
						}

						holeCounter++;

						if (i === stonesCounter - 1) {
							if (this.turn === 'Player 1' && holeEl.number !== 14) {
								this.turn = 'Player 2';
							} else if (this.turn === 'Player 2' && holeEl.number !== 7) {
								this.turn = 'Player 1';
							}
						}
						

					} else {
						holeCounter++;
						i--;
					}
				}
			}

			this.checkWin();
		},

		makeOpposingCapture: function(holeElement, oppositeHoleIndex) {
			var storeIndex;
			if (this.turn === 'Player 1') {
				storeIndex = 13;
			} else {
				storeIndex = 6;
			}
			this.holes[storeIndex].stones += holeElement.stones + this.holes[oppositeHoleIndex].stones;
			holeElement.stones = 0;
			this.holes[oppositeHoleIndex].stones = 0;
		},

		checkOpposingHoleCondition: function(holeElement) {
			for(var i = 0; i < this.opposingHolePairs.length; i++) {
				var holeElIndex = holeElement.number - 1;
				
				if (this.opposingHolePairs[i][holeElIndex] >= 0) {
					this.makeOpposingCapture(holeElement, this.opposingHolePairs[i][holeElIndex]);
				}
			}
		},

		checkWin: function() {
			var player1out = true;
			var player2out = true;
			for (var i = 7; i < 13; i++) {
				if (this.holes[i].stones > 0) {
					player1out = false;
				}
			}
			for (var i = 0; i < 6; i++) {
				if (this.holes[i].stones > 0) {
					player2out = false;
				}
			}

			if (player1out) {
				for (var i = 0; i < 6; i++) {
					this.holes[6].stones += this.holes[i].stones
					this.holes[i].stones = 0;
				}

				this.determineWinner();
			}

			if (player2out) {
				for (var i = 7; i < 13; i++) {
					this.holes[13].stones += this.holes[i].stones
					this.holes[i].stones = 0;
				}

				this.determineWinner();
			}
		},

		determineWinner: function() {
			if (this.holes[6].stones > this.holes[13].stones) {
				this.winner = 'Player 2';
				this.winnerHeading = 'Congratulations, Player 2! You Win!';
			} else if (this.holes[13].stones > this.holes[6].stones) {
				this.winner = 'Player 1';
				this.winnerHeading = 'Congratulations, Player 1! You Win!';
			} else {
				this.winner = 'Tie';
				this.winnerHeading = 'It\'s a tie!';
			}
		},

		reset: function() {
			this.holes = [];
			this.winner = '';
			this.winnerHeading = '';
			this.turn = 'Player 1';
			this.players.player1.points = 0;
			this.players.player2.points = 0;
			this.makeHoles();
		}
	},

	created: function() {
		this.makeHoles();
	},

	mounted: function() {
		const canvasEls = document.querySelectorAll(".mancala__grass-canvas");
		draw(canvasEls[0]);
		draw(canvasEls[1]);
		function draw(canvas) {
			// const canvas = document.querySelector(".mancala__grass-canvas");
			const ctx = canvas.getContext("2d");
			ctx.fillStyle = "#7f8714";
			const { width: w, height: h } = canvas;
			let x, y, bladeWidth;
			for (let i = 0; i < 1500; i++) {
				x = Math.random() * w;
				y = Math.random() * h;
				bladeWidth = Math.random() * 3;
				ctx.beginPath();
				ctx.lineTo(x+(bladeWidth), y+(bladeWidth*6));
				ctx.lineTo(x+(bladeWidth*.75), y+(bladeWidth*6));
				ctx.lineTo(x+(bladeWidth*.25), y+(bladeWidth*6));
				ctx.lineTo(x, y);
				ctx.fill();
			}
		}
	}
}

var Mancala = {
	template: `
		<div class="mancala">
			<h1 class="mancala__heading1">Mancala</h1>
			
			<div class="mancala__board-wrapper">
				<man-board></man-board>
			</div>
		</div>
	`,

	components: {
		manBoard: manBoard
	}
}

var app = new Vue({
	el: '#app',

	components: {
		mancala: Mancala
	}
});
