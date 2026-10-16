/* ============================================================
   Learning with Sarah — Main Script
   ============================================================ */

/* ------------------------------------------------------------
   1. MOBILE NAVIGATION
   ------------------------------------------------------------ */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ------------------------------------------------------------
   2. LANGUAGE TOGGLE (simple html[lang] flip)
   ------------------------------------------------------------ */
const languageToggle = document.getElementById("languageToggle");
const htmlRoot = document.getElementById("htmlRoot") || document.documentElement;

function setLanguage(lang) {
  htmlRoot.lang = lang;
  htmlRoot.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.dir = lang === "ar" ? "rtl" : "ltr";

  try { localStorage.setItem("preferredLang", lang); } catch (e) {}
}

// Restore saved language on load
try {
  const saved = localStorage.getItem("preferredLang");
  if (saved === "ar") setLanguage("ar");
} catch (e) {}

// Toggle button
if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    const newLang = htmlRoot.lang === "ar" ? "en" : "ar";
    setLanguage(newLang);
  });
}

/* ------------------------------------------------------------
   3. FOOTER YEAR
   ------------------------------------------------------------ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ------------------------------------------------------------
   4. SIMPLE ARABIC LETTER GAME
   ------------------------------------------------------------ */
const questions = [
  { letter: "ا", answer: "Alif", options: ["Alif", "Baa", "Taa"] },
  { letter: "ب", answer: "Baa", options: ["Taa", "Baa", "Thaa"] },
  { letter: "ت", answer: "Taa", options: ["Jeem", "Alif", "Taa"] },
  { letter: "ث", answer: "Thaa", options: ["Baa", "Thaa", "Noon"] },
  { letter: "ج", answer: "Jeem", options: ["Jeem", "Haa", "Khaa"] },
  { letter: "م", answer: "Meem", options: ["Laam", "Meem", "Seen"] },
  { letter: "ن", answer: "Noon", options: ["Noon", "Baa", "Qaaf"] }
];

const letterDisplay = document.getElementById("letterDisplay");
const gameOptions = document.getElementById("gameOptions");
const gameFeedback = document.getElementById("gameFeedback");

let questionIndex = 1;
let score = 0;
let answered = false;
let currentQuestion = questions[1];

function renderQuestion() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  answered = false;
  letterDisplay.textContent = currentQuestion.letter;

  // Bilingual feedback message
  const isAr = document.documentElement.lang === "ar";
  gameFeedback.innerHTML = isAr
    ? '<span class="ar-only">اختر إجابة للبدء.</span>'
    : '<span class="en-only">Choose an answer to begin.</span>';
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

  const roundEl = document.getElementById("round");
  if (roundEl) roundEl.textContent = questionIndex;
}

function checkAnswer(option, selectedButton) {
  if (answered) return;
  answered = true;
  const isAr = document.documentElement.lang === "ar";
  const correct = option === currentQuestion.answer;

  if (correct) {
    score++;
    gameFeedback.innerHTML = isAr
      ? '<span class="ar-only">أحسنت! عمل رائع. 🌟</span>'
      : '<span class="en-only">Correct! Great work. 🌟</span>';
    gameFeedback.className = "game-feedback correct";
  } else {
    gameFeedback.innerHTML = isAr
      ? `<span class="ar-only">حاول مرة أخرى. الإجابة الصحيحة هي ${currentQuestion.answer}.</span>`
      : `<span class="en-only">Not quite. The correct answer is ${currentQuestion.answer}.</span>`;
    gameFeedback.className = "game-feedback incorrect";
  }

  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = score;

  [...gameOptions.querySelectorAll("button")].forEach(button => {
    button.disabled = true;
    if (button.dataset.answer === currentQuestion.answer) {
      button.style.borderColor = "#5a8a68";
    }
  });
}

const nextQuestionBtn = document.getElementById("nextQuestion");
if (nextQuestionBtn) {
  nextQuestionBtn.addEventListener("click", () => {
    questionIndex++;
    renderQuestion();
  });
}

if (letterDisplay && gameOptions && gameFeedback) {
  renderQuestion();
}

/* ------------------------------------------------------------
   5. HOMEWORK CHECKLIST (saved locally)
   ------------------------------------------------------------ */
const taskInputs = [...document.querySelectorAll("#taskList input[type='checkbox']")];
const storageKey = "learningWithSarahHomeworkV1";

function updateProgress() {
  if (taskInputs.length === 0) return;
  const done = taskInputs.filter(input => input.checked).length;
  const fill = document.getElementById("progressFill");
  const label = document.getElementById("progressLabel");

  if (fill) fill.style.width = `${(done / taskInputs.length) * 100}%`;

  if (label) {
    const isAr = document.documentElement.lang === "ar";
    label.innerHTML = isAr
      ? `<span class="ar-only">${done} من ${taskInputs.length} مهام مكتملة</span>`
      : `<span class="en-only">${done} of ${taskInputs.length} tasks completed</span>`;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(taskInputs.map(input => input.checked)));
  } catch (_) {}
}

// Restore saved checklist state
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (Array.isArray(saved)) {
    taskInputs.forEach((input, index) => {
      input.checked = Boolean(saved[index]);
    });
  }
} catch (_) {}

taskInputs.forEach(input => input.addEventListener("change", updateProgress));

const resetTasksBtn = document.getElementById("resetTasks");
if (resetTasksBtn) {
  resetTasksBtn.addEventListener("click", () => {
    taskInputs.forEach(input => (input.checked = false));
    updateProgress();
  });
}

updateProgress();

/* ------------------------------------------------------------
   6. AUDIO PLAYBACK (browser TTS)
   ------------------------------------------------------------ */
document.querySelectorAll(".audio-play").forEach(button => {
  button.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      const isAr = document.documentElement.lang === "ar";
      alert(isAr
        ? "الصوت غير مدعوم في هذا المتصفح."
        : "Audio playback is not supported by this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
    utterance.lang = "ar";
    utterance.rate = 0.78;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.toLowerCase().startsWith("ar"));
    if (arabicVoice) utterance.voice = arabicVoice;

    window.speechSynthesis.speak(utterance);
  });
});

/* ------------------------------------------------------------
   7. LANGUAGE CHANGE RE-RENDER
   ------------------------------------------------------------ */
// When the language changes, some JS-generated content
// (game feedback, homework label) needs to be re-rendered.
// We listen for a custom event that the toggle fires.
window.addEventListener("languageChanged", () => {
  updateProgress();

  // Reset game feedback to neutral message in the new language
  if (gameFeedback && !gameFeedback.classList.contains("correct") && !gameFeedback.classList.contains("incorrect")) {
    const isAr = document.documentElement.lang === "ar";
    gameFeedback.innerHTML = isAr
      ? '<span class="ar-only">اختر إجابة للبدء.</span>'
      : '<span class="en-only">Choose an answer to begin.</span>';
  }
});