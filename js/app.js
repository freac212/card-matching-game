/**
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* Create a list that holds all of your cards/ Constants, stored variables, etc
 */
let cardDeck = document.querySelectorAll(".card"); 
const deckClass = document.querySelector(".deck");

let moveCount = 0;
const moveCounterHTML = document.querySelector(".moves");

let timeoutID;
let displayTimeoutID;

const starRating = document.querySelector(".stars").children;
const threeStarRank = 20;
const twoStarRank = 24;
let starRatingNum = 3;

let storedFaceUpCards = [];

// Runs a new game on start, that's mainly for the shuffle.
newGame();

// Event on the tiles, whenever someone clicks on the tiles.
deckClass.addEventListener("click", cardCompare);

// Some hardcore delegation, it's just making sure you're clicking that really tiny restart icon, while adding an event listener.
document.body.querySelector(".restart").children[0].addEventListener("click", newGame);



/**#### Effectively the 'game' function, even though it's called cardCompare; ####
 * On click of a tile:
 * calls/ invokes moveCounter (adds one per move to the counter)
 * gives the "card open show" classes to the targeted tile,
 * it checks to see if you're clicking a tile,
 * if so, it checks all the other possible tiles for the class "show" ########## Maybe rework that, have it store the previously clicked in the JS;
 * 
 * puts the two possible cards into an array, 
 * if there's two in the array it removes the event listener so you cannot click the tiles until we add the event listener back
 */
function cardCompare (e){
	// Using a 'STRICT' compare, we only want to be able to click tiles with the class card, not ones that are already flipped i.e. tiles with more than just "card" class; matched, shown, etc..
	if(e.target.getAttribute("class") === "card"){
		displayCardSymbol(e);
		storeFaceUpCards(e);
		let cardFlip1 = storedFaceUpCards[0];
		let cardFlip2 = storedFaceUpCards[1];

		if(storedFaceUpCards.length === 2){
			// Remove event listener to prevent additional clicking
			deckClass.removeEventListener("click", cardCompare);
			
			// Check if the two cards are alike
			if(cardFlip1.children[0].getAttribute("class") === cardFlip2.children[0].getAttribute("class")){
				cardsAlike(cardFlip1, cardFlip2);
				resetStoredArray();
				// Re-enabling the event listener
				deckClass.addEventListener("click", cardCompare);

			} else {
				// Otherwise, flip the cards back over (by setting their class back to default) because they did not match.
				tileDisplayTimeout(cardFlip1, cardFlip2);
				resetStoredArray();
			}
			// Count moves after two cards have been flipped face up, match or not.
			moveCounter();
		} 
	}
}

function cardsAlike(cardFlip1, cardFlip2){
	// Lock cards in face up (Match)
	cardFlip1.setAttribute("class", "card open match");
	cardFlip2.setAttribute("class", "card open match");
	// Increment move
	moveCounter();
	// Check win; return a boolean
	if(isWin()){ 
		swal({
			title: 'You won!',
			html: `Rating: ${starRatingCountHTML()}`,
			footer: `You won in ${moveCount} moves!`,
			type: 'success',
			confirmButtonText: 'New Game?'
		});

		// Event listener for the SweetAlert submit button, restarts the game.
		document.body.querySelector(".swal2-confirm").addEventListener("click", newGame);
		// I left this because I prefer console feedback. It can otherwise be removed.
		// console.log("You won in " + moveCount + " moves.");
	}
}

function moveCounter(){
	// Increment Move counter
	moveCount++;
	// Apply move counter to HTML
	moveCounterHTML.innerText = moveCount;
	// Set the gold star rating on first click, you start with three and it goes down the more moves you make.
	// #### I purposefully had it start at black then change to gold on first move, that is intended. ####
	// Making a loop for this stuff would take more time and the same amout of lines, time constrained aswell.
	if(moveCount <= threeStarRank){
		starRating[0].children[0].style.color = "gold";
		starRating[1].children[0].style.color = "gold";
		starRating[2].children[0].style.color = "gold";

	} else if(moveCount <= twoStarRank){
		starRating[0].children[0].style.color = "gold";
		starRating[1].children[0].style.color = "gold";
		starRating[2].children[0].style.color = "black";
		starRatingNum = 2;

	} else if(moveCount > twoStarRank) {
		starRating[0].children[0].style.color = "gold";
		starRating[1].children[0].style.color = "black";
		starRating[2].children[0].style.color = "black";
		starRatingNum = 1;
	}	
}

function displayCardSymbol(e){
	// Apply open show class
	e.target.setAttribute("class", "card open show");
}

function resetStoredArray(){
	// Fairly self explanitory, resets the stored array to empty.
	storedFaceUpCards = [];
}

function storeFaceUpCards(e){
	// Takes an element as an arg, adds it to the stored face up cards. Max 2 cards in the array.
	storedFaceUpCards.push(e.target);
}

function starRatingCountHTML(){
	// Switch statement with no breaks, as they're not required with returns.
	switch (starRatingNum) {
		case 3:
			return `<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>`;

		case 2:
			return `<i class="fa fa-star"></i><i class="fa fa-star">`;

		case 1:
			return `<i class="fa fa-star"></i>`;
	
		default:
			return "You broke me game!";
	}
}

function isWin(){
	for(const card of cardDeck){
		// If a card equals class card, returns false because the game still has a card class.
		if(card.getAttribute("class") === "card"){
			return false;
		}
	}
	// if it goes through the loop and hits a card with card, it returns false, else, finishes the loop and returns true;
	return true;
}

function tileDisplayTimeout(cardFlip1, cardFlip2){
	displayTimeoutID = window.setTimeout(function(){
		// flip em back over(by setting their class back to default)
		cardFlip1.setAttribute("class", "card");
		cardFlip2.setAttribute("class", "card");
		// add the event listener back after 1000 miliseconds (1 second).
		deckClass.addEventListener("click", cardCompare);
		
	}, 1000);
}

function newGame(){
	// add the event listener, again just incase
	deckClass.addEventListener("click", cardCompare);
	// set all cards to default class;
	for(const card of cardDeck){
		card.setAttribute("class", "card");
	}
	// reset all the selectors and counters/ interators
	moveCount = 0;
	moveCounterHTML.innerText = moveCount;
	starRatingNum = 3;
	starRating[0].children[0].style.color = "black";
	starRating[1].children[0].style.color = "black";
	starRating[2].children[0].style.color = "black";
	// reorganize all cards;
	shuffleCards();
}

function shuffleCards(){
/*	Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
	// get an array from the current cardDeck
	cardDeck = Array.from(cardDeck);
	// Shuffle said array
	cardDeck = shuffle(cardDeck);

	// Empty the HTML of the class first
	deckClass.innerHTML = "";
	// Apply the shuffeled array to the html!
	for (const card of cardDeck){
		deckClass.appendChild(card);
	}
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
