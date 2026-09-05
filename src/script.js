const board = document.getElementById('game-board');
const moveCounter = document.getElementById('move-counter');
const restartBtn = document.getElementById('restart-btn');
const scoreList = document.getElementById('score-list');
const winModal = document.getElementById('win-modal');
const finalMovesDisplay = document.getElementById('final-moves');
const playerInitialsInput = document.getElementById('player-initials');
const saveScoreBtn = document.getElementById('save-score-btn');

const cardData = [
  { id: 1, img: '/src/assets/Images/hat1.jpg' },
  { id: 2, img: '/src/assets/Images/hat2.jpg' },
  { id: 3, img: '/src/assets/Images/hat3.jpg' },
  { id: 4, img: '/src/assets/Images/hat4.jpg' },
  { id: 5, img: '/src/assets/Images/hat5.jpg' },
  { id: 6, img: '/src/assets/Images/hat6.jpg' },
  { id: 7, img: '/src/assets/Images/hat7.jpg' },
  { id: 8, img: '/src/assets/Images/hat8.jpg' },
];

let cards = [];
let flippedCards = [];
let moves = 0;
let matchedPairsCount = 0;
let lockBoard = false;
let highScores = [];

function initGame() {
  board.innerHTML = '';
  flippedCards = [];
  moves = 0;
  matchedPairsCount = 0;
  lockBoard = false;
  moveCounter.textContent = moves;
  winModal.classList.add('hidden');
  playerInitialsInput.value = '';

  cards = [...cardData, ...cardData]
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({
      ...card,
      uniqueId: index,
      isFlipped: false,
      isMatched: false,
    }));

  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.index = index;

    // The question mark is removed; only the image loads dynamically
    cardElement.innerHTML = `
      <img src="${card.img}" alt="Trucker Hat" draggable="false">
    `;

    cardElement.addEventListener('click', () => flipCard(cardElement, index));
    board.appendChild(cardElement);
  });

  renderScores();
}

function flipCard(cardElement, index) {
  if (lockBoard || cards[index].isMatched || cards[index].isFlipped) return;

  cardElement.classList.add('flipped');
  cards[index].isFlipped = true;
  flippedCards.push({ element: cardElement, index });

  if (flippedCards.length === 2) {
    moves++;
    moveCounter.textContent = moves;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = cards[card1.index].id === cards[card2.index].id;

  if (isMatch) {
    cards[card1.index].isMatched = true;
    cards[card2.index].isMatched = true;
    card1.element.classList.add('matched');
    card2.element.classList.add('matched');
    flippedCards = [];
    matchedPairsCount++;

    if (matchedPairsCount === cardData.length) {
      setTimeout(showWinScreen, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.element.classList.remove('flipped');
      card2.element.classList.remove('flipped');
      cards[card1.index].isFlipped = false;
      cards[card2.index].isFlipped = false;
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function showWinScreen() {
  finalMovesDisplay.textContent = moves;
  winModal.classList.remove('hidden');
  playerInitialsInput.focus();
}

function saveScore() {
  let initials = playerInitialsInput.value.trim().toUpperCase();
  if (initials.length === 0) {
    initials = '???';
  }

  highScores.push({ name: initials, score: moves });
  highScores.sort((a, b) => a.score - b.score);

  if (highScores.length > 10) {
    highScores.pop();
  }

  initGame();
}

function renderScores() {
  scoreList.innerHTML = '';

  if (highScores.length === 0) {
    scoreList.innerHTML = '<li>No scores yet!</li>';
    return;
  }

  highScores.forEach((entry) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${entry.name}</strong> <span>${entry.score} moves</span>`;
    scoreList.appendChild(li);
  });
}

restartBtn.addEventListener('click', initGame);
saveScoreBtn.addEventListener('click', saveScore);

playerInitialsInput.addEventListener('input', function () {
  this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '');
});

initGame();
