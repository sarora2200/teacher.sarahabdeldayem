// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Update footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Simple Arabic letter game
const questions = [
  { letter: "ا", answer: "Alif", options: ["Alif", "Baa", "Taa"] },
  { letter: "ب", answer: "Baa", options: ["Taa", "Baa", "Thaa"] },
  { letter: "ت", answer: "Taa", options: ["Jeem", "Alif", "Taa"] },
  { letter: "ث", answer: "Thaa", options: ["Baa", "Thaa", "Noon"] },
  { letter: "ج", answer: "Jeem", options: ["Jeem", "Haa", "Khaa"] },
  { letter: "م", answer: "Meem", options: ["Laam", "Meem", "Seen"] },
  { letter: "ن", answer: "Noon", options: ["Noon", "Baa", "Qaaf"] }
];
let questionIndex = 1;
let score = 0;
let answered = false;
let currentQuestion = questions[1];
const letterDisplay = document.getElementById("letterDisplay");
const gameOptions = document.getElementById("gameOptions");
const gameFeedback = document.getElementById("gameFeedback");

function renderQuestion() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  answered = false;
  letterDisplay.textContent = currentQuestion.letter;
  gameFeedback.textContent = "Choose an answer to begin.";
  gameFeedback.className = "game-feedback";
  gameOptions.innerHTML = "";
  currentQuestion.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.textContent = option;
    button.dataset.answer = option;
    button.addEventListener("click", () => checkAnswer(option, button));
    gameOptions.appendChild(button);
  });
  document.getElementById("round").textContent = questionIndex;
}
function checkAnswer(option, selectedButton) {
  if (answered) return;
  answered = true;
  const correct = option === currentQuestion.answer;
  if (correct) {
    score++;
    gameFeedback.textContent = "Correct! Great work. 🌟";
    gameFeedback.className = "game-feedback correct";
  } else {
    gameFeedback.textContent = `Not quite. The correct answer is ${currentQuestion.answer}.`;
    gameFeedback.className = "game-feedback incorrect";
  }
  document.getElementById("score").textContent = score;
  [...gameOptions.querySelectorAll("button")].forEach(button => {
    button.disabled = true;
    if (button.dataset.answer === currentQuestion.answer) button.style.borderColor = "#5a8a68";
  });
}
document.getElementById("nextQuestion").addEventListener("click", () => {
  questionIndex++;
  renderQuestion();
});
renderQuestion();

// Homework checklist: saved locally in this browser only
const taskInputs = [...document.querySelectorAll("#taskList input[type='checkbox']")];
const storageKey = "learningWithNoorHomeworkV1";
function updateProgress() {
  const done = taskInputs.filter(input => input.checked).length;
  document.getElementById("progressFill").style.width = `${(done / taskInputs.length) * 100}%`;
  document.getElementById("progressLabel").textContent = `${done} of ${taskInputs.length} tasks completed`;
  try { localStorage.setItem(storageKey, JSON.stringify(taskInputs.map(input => input.checked))); } catch (_) {}
}
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (Array.isArray(saved)) taskInputs.forEach((input, index) => input.checked = Boolean(saved[index]));
} catch (_) {}
taskInputs.forEach(input => input.addEventListener("change", updateProgress));
document.getElementById("resetTasks").addEventListener("click", () => {
  taskInputs.forEach(input => input.checked = false);
  updateProgress();
});
updateProgress();
