// ==========================================
// Simple Online Quiz Exam with Local Storage
// ==========================================

// 1. Array of Questions
const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink and Text Management Language",
      "Home Tool Markup Language"
    ],
    correct: 0
  },
  {
    question: "Which HTML tag is used to include JavaScript code?",
    options: ["<js>", "<javascript>", "<script>", "<link>"],
    correct: 2
  },
  {
    question: "Which CSS property is used to change text color?",
    options: ["font-color", "color", "text-color", "style-color"],
    correct: 1
  },
  {
    question: "Which method is used to store data in browser Local Storage?",
    options: [
      "localStorage.save()",
      "localStorage.store()",
      "localStorage.setItem()",
      "localStorage.put()"
    ],
    correct: 2
  },
  {
    question: "What is the correct syntax for referring to an external script called 'app.js'?",
    options: [
      "<script href='app.js'>",
      "<script src='app.js'>",
      "<script link='app.js'>",
      "<script file='app.js'>"
    ],
    correct: 1
  }
];

// Global State Variables
let currentQuestionIndex = 0;
let score = 0;
let loggedInUser = "";

// DOM Elements
const loginSection = document.getElementById("login-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMsg = document.getElementById("login-msg");

const userDisplay = document.getElementById("user-display");
const questionCount = document.getElementById("question-count");
const questionText = document.getElementById("question-text");
const optionsBox = document.getElementById("options-box");
const btnNext = document.getElementById("btn-next");

const resUsername = document.getElementById("res-username");
const currentScoreEl = document.getElementById("current-score");
const highestScoreEl = document.getElementById("highest-score");
const highScoreNote = document.getElementById("high-score-note");
const btnRestart = document.getElementById("btn-restart");
const btnLogout = document.getElementById("btn-logout");

// ==========================================
// 2. Login Logic using Local Storage
// ==========================================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    loginMsg.textContent = "Please enter both username and password.";
    return;
  }

  // Retrieve stored users from Local Storage (or create empty list)
  let users = JSON.parse(localStorage.getItem("quiz_users")) || {};

  // Check if user already exists
  if (users[username]) {
    // If user exists, verify password
    if (users[username] !== password) {
      loginMsg.textContent = "Incorrect password! Try again.";
      return;
    }
  } else {
    // If new user, save credentials to localStorage
    users[username] = password;
    localStorage.setItem("quiz_users", JSON.stringify(users));
  }

  // Store currently active logged in user in localStorage
  loggedInUser = username;
  localStorage.setItem("current_user", loggedInUser);

  // Clear inputs and switch to Quiz screen
  loginMsg.textContent = "";
  usernameInput.value = "";
  passwordInput.value = "";

  startQuiz();
});

// ==========================================
// 3. Quiz Exam Logic
// ==========================================
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;

  loginSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  quizSection.classList.remove("hidden");

  userDisplay.querySelector("strong").textContent = loggedInUser;
  loadQuestion();
}

function loadQuestion() {
  const currentQ = questions[currentQuestionIndex];

  questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionText.textContent = currentQ.question;
  optionsBox.innerHTML = "";

  // Render 4 Radio Options
  currentQ.options.forEach((opt, index) => {
    const div = document.createElement("div");
    div.className = "option-item";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz_opt";
    radio.id = "opt_" + index;
    radio.value = index;

    const label = document.createElement("label");
    label.htmlFor = "opt_" + index;
    label.textContent = opt; // textContent safely displays <script>, <js>, etc.

    div.appendChild(radio);
    div.appendChild(label);

    // Clicking anywhere on the option item selects the radio
    div.addEventListener("click", () => {
      radio.checked = true;
    });

    optionsBox.appendChild(div);
  });

  // Change button text for last question
  if (currentQuestionIndex === questions.length - 1) {
    btnNext.textContent = "Submit Exam";
  } else {
    btnNext.textContent = "Next Question";
  }
}

// Next / Submit Button Click
btnNext.addEventListener("click", function () {
  const selectedOption = document.querySelector("input[name='quiz_opt']:checked");

  if (!selectedOption) {
    alert("Please select an answer before proceeding!");
    return;
  }

  // Check if answer is correct
  const answerIndex = parseInt(selectedOption.value);
  if (answerIndex === questions[currentQuestionIndex].correct) {
    score++;
  }

  currentQuestionIndex++;

  // If more questions exist, load next; otherwise show results
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

// ==========================================
// 4. Output Result & Highest Score Logic
// ==========================================
function showResults() {
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");

  resUsername.textContent = loggedInUser;
  currentScoreEl.textContent = score;

  // Key Feature: Get and Update Highest Score in Local Storage
  // Storage key is unique per user (e.g., "highest_score_john")
  const userHighScoreKey = "highest_score_" + loggedInUser;
  let storedHighestScore = localStorage.getItem(userHighScoreKey);

  // If first time, set storedHighest to 0
  if (storedHighestScore === null) {
    storedHighestScore = 0;
  } else {
    storedHighestScore = parseInt(storedHighestScore);
  }

  // Check if current score is greater than highest score
  if (score > storedHighestScore) {
    // Save new highest score into Local Storage
    localStorage.setItem(userHighScoreKey, score);
    highestScoreEl.textContent = score;
    highScoreNote.textContent = "🎉 Congratulations! New personal highest score!";
  } else {
    highestScoreEl.textContent = storedHighestScore;
    highScoreNote.textContent = "Keep trying to beat your highest score!";
  }
}

// ==========================================
// 5. Restart & Logout Handlers
// ==========================================
btnRestart.addEventListener("click", function () {
  startQuiz();
});

btnLogout.addEventListener("click", function () {
  localStorage.removeItem("current_user");
  loggedInUser = "";

  resultSection.classList.add("hidden");
  quizSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

// Check if user was already logged in on page load
window.onload = function () {
  const savedUser = localStorage.getItem("current_user");
  if (savedUser) {
    loggedInUser = savedUser;
    startQuiz();
  }
};
