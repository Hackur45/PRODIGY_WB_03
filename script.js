const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const roundsInput = document.getElementById('roundsInput');
const messageElement = document.getElementById('message');
const xWinsElement = document.getElementById('xWins');
const oWinsElement = document.getElementById('oWins');
const scores = document.getElementById('scores');
const flipCard = document.getElementById('flip-card');
const flipCardInner = document.querySelector('.flip-card-inner');
const flipCardfront = document.querySelector('.flip-card-front');
let currentPlayer = 'X';
let gameActive = true;
let currentRound = 1;
let totalRounds = 1;
let xWins = 0;
let oWins = 0;

const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startButton.addEventListener('click', () => {
    totalRounds = parseInt(roundsInput.value);
    resetGame();
    startButton.classList.add('hidden');
    roundsInput.classList.add('hidden');
    board.classList.remove('hidden');
    restartButton.classList.remove('hidden');
    scores.classList.remove('hidden');
    flipCard.classList.remove('hidden');
});

const resetGame = () => {
    xWins = 0;
    oWins = 0;
    currentRound = 1;
    messageElement.textContent = '';
    updateScore();
    startGame();
};

const startGame = () => {
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('o');
        cell.textContent = '';
        cell.removeEventListener('click', handleClick); // Ensure no duplicate event listeners
        cell.addEventListener('click', handleClick, { once: true });
    });
    currentPlayer = 'X';
    gameActive = true;
    updateTurnIndicator();
};

const handleClick = (e) => {
    const cell = e.target;
    const currentClass = currentPlayer.toLowerCase();
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateTurnIndicator();
    }
};

const placeMark = (cell, currentClass) => {
    cell.classList.add(currentClass);
    cell.textContent = currentPlayer;
};

const swapTurns = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    flipCardInner.classList.toggle('flip');
};

const updateTurnIndicator = () => {
    const frontText = flipCardInner.querySelector('.flip-card-front p');
    // const backText = flipCardInner.querySelector('.flip-card-back p');
    if (currentPlayer === 'X') {
        frontText.textContent = "It's X's Turn";
        // backText.textContent = "It's O's Turn";
    } else {
        frontText.textContent = "It's O's Turn";
        // backText.textContent = "It's X's Turn";
    }
};

const checkWin = (currentClass) => {
    return winningCombination.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
};

const isDraw = () => {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
};

const endGame = (draw) => {
    if (draw) {
        messageElement.textContent = "It's a draw!";
    } else {
        messageElement.textContent = `${currentPlayer} wins!`;
        currentPlayer === 'X' ? xWins++ : oWins++;
    }
    gameActive = false;
    updateScore();
    setTimeout(() => {
        if (currentRound < totalRounds) {
            currentRound++;
            startGame();
        } else {
            displayFinalWinner();
        }
    }, 2000);
};

const updateScore = () => {
    xWinsElement.textContent = xWins;
    oWinsElement.textContent = oWins;
};

const displayFinalWinner = () => {
    if (xWins > oWins) {
        messageElement.textContent = "Player X wins the series!";
    } else if (oWins > xWins) {
        messageElement.textContent = "Player O wins the series!";
    } else {
        messageElement.textContent = "The series is tied!";
    }
    startButton.classList.remove('hidden');
    roundsInput.classList.remove('hidden');
    board.classList.add('hidden');
    restartButton.classList.add('hidden');
    flipCard.classList.add('hidden');
};

restartButton.addEventListener('click', () => {
    currentRound = 1;
    resetGame();
    board.classList.remove('hidden');
    messageElement.textContent = '';
});
