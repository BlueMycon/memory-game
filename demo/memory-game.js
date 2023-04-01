"use strict";

const FOUND_MATCH_WAIT_MSECS = 1000;
let score = 0;
let numberOfCards = 10;
let colors = generateRandomColors(numberOfCards);

const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", startGame);

const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", restartGame);

function startGame() {
  score = 0;
  document.getElementById("score").innerText = `Score: ${score}`;
  createCards(colors);
  startBtn.disabled = true;
}

function restartGame() {
  document.getElementById("game").innerHTML = "";
  colors = generateRandomColors(numberOfCards);
  startGame();
}

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function generateRandomColors(num) {
  const colors = [];
  for (let i = 0; i < num; i++) {
    const color = getRandomColor();
    colors.push(color, color);
  }
  return shuffle(colors);
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const card = document.createElement("div");
    card.classList.add(color);
    card.addEventListener("click", handleCardClick);
    gameBoard.append(card);
  }
}

function flipCard(card) {
  card.classList.add("flipped");
  card.style.backgroundColor = card.classList[0];
  card.classList.add("toMatch");
  card.removeEventListener("click", handleCardClick);
}

function unFlipCard(card) {
  card.classList.remove("flipped");
  card.style.backgroundColor = "";
  card.classList.remove("toMatch");
  card.addEventListener("click", handleCardClick);
}

function handleCardClick(evt) {
  const card = evt.target;
  const cardToMatch = document.querySelector(".toMatch");

  flipCard(card);

  if (!cardToMatch) {
    return;
  }

  score++;
  document.getElementById("score").innerText = `Score: ${score}`;

  if (card.classList[0] === cardToMatch.classList[0]) {
    card.classList.remove("toMatch");
    cardToMatch.classList.remove("toMatch");
    card.classList.add("matched");
    cardToMatch.classList.add("matched");
    checkGameOver();
  } else {
    const unflipped = document.querySelectorAll("#game div:not(.toMatch):not(.matched)");
    unflipped.forEach(elem => elem.removeEventListener("click", handleCardClick));
    setTimeout(function () {
      unFlipCard(card);
      unFlipCard(cardToMatch);
      unflipped.forEach(elem => elem.addEventListener("click", handleCardClick));
    }, FOUND_MATCH_WAIT_MSECS);
  }
}

function checkGameOver() {
  const unmatchedCards = document.querySelectorAll("#game div:not(.matched)");

  if (unmatchedCards.length === 0) {
    const bestScore = localStorage.getItem("bestScore");
    if (bestScore === null || score < parseInt(bestScore, 10)) {
      localStorage.setItem("bestScore", score);
      document.getElementById("best-score").innerText = `Best Score: ${score}`;
    }
    startBtn.disabled = false;
  }
}

document.getElementById("best-score").innerText = `Best Score: ${localStorage.getItem("bestScore")}`;
