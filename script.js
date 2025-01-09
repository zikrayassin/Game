const gridContainer = document.querySelector(".grid-container");
const container = document.querySelector(".container");
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let startTime, timerInterval;
document.querySelector(".score").textContent = score;

const cardsData = [
  {
      "image": "images/chili.png",
      "name": "chili"
  },
  {
      "image": "images/grapes.png",
      "name": "grapes"
  },
  {
      "image": "images/lemon.png",
      "name": "lemon"
  },
  {
      "image": "images/orange.png",
      "name": "orange"
  },
  {
      "image": "images/pineapple.png",
      "name": "pineapple"
  },
  {
      "image": "images/strawberry.png",
      "name": "strawberry"
  },
  {
      "image": "images/tomato.png",
      "name": "tomato"
  },
  {
      "image": "images/watermelon.png",
      "name": "watermelon"
  },
  {
      "image": "images/cherries.png",
      "name": "cherries"
  }
];
let cards = [...cardsData, ...cardsData];
shuffleCards();
generateCards();
function shuffleCards() {
  let i = cards.length,
    randomIndex,
    temp;
  while (--i > 0) {
    randomIndex = Math.floor(Math.random() * (i+1));
    temp = cards[i];
    cards[i] = cards[randomIndex];
    cards[randomIndex] = temp;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
 
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if(isMatch){
    disableCards()
  }
  else{
    unflipCards()
    score++;
    document.querySelector(".score").textContent = score;
  }
  checkIfGameComplete();
}

function checkIfGameComplete()
{ 
  const allMatched = document.querySelectorAll(".card.flipped").length === cards.length; 
  if (allMatched)
     { 
      endGame();
      } 
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 600);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;  
}

function start() {
  cardElements = document.querySelectorAll(".card");
  for (let cardElement of cardElements) {
    cardElement.addEventListener("click", flipCard);
  }
  resetBoard();
  shuffleCards();
  startTimer();
}
function cancel(){
  stopTimer();
  resetBoard();
  score = 0;
  shuffleCards();
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();

}
function startTimer() {
   startTime = new Date(); 
   timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() { 
    const now = new Date(); 
    const elapsedTime = Math.floor((now - startTime) / 1000); 
    document.getElementById('timer').textContent = `Time taken: ${elapsedTime}s`;
}

function stopTimer(){ 
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = null;
} 

function endGame() {
  stopTimer();
  const elapsedTime = Math.floor((new Date() - startTime) / 1000);
  
  const gameOverElement = document.createElement("div");
  gameOverElement.classList.add("game-over");
  gameOverElement.innerHTML = `
    <h1>Congratulations!</h1>
    <p>You've completed the game.</p>
    <p>Wrong Guesses: ${score}</p>
    <p>You completed the game in ${elapsedTime} seconds</p>
    <div class="actions">
    <button id="restartButton">Restart</button>
    <button id="cancelButton">Cancel</button>
     </div>`;
   
  document.body.appendChild(gameOverElement); 

  document.getElementById("restartButton").addEventListener("click", () => {
      clearGameOverMessage();
      document.querySelector(".score").textContent = score;
      gridContainer.innerHTML = ""; 
      generateCards();
      score = 0;
      start();
  });
  document.getElementById("cancelButton").addEventListener("click", () => {
            cancel();
            clearGameOverMessage();
  });
}
function clearGameOverMessage() {
  const gameOverElement = document.querySelector(".game-over");
  if (gameOverElement) {
    gameOverElement.remove();
  }
}

