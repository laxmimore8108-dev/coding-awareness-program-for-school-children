// ============================================
// CodeKids - Shared JavaScript
// With Question Shuffle Feature
// ============================================

// ===== 1. PATTERN DEMO (used in learn.html) =====
function drawPattern() {
    const input = document.getElementById('patternInput');
    const output = document.getElementById('patternOutput');
    if (!input || !output) return;

    const n = parseInt(input.value);
    if (isNaN(n) || n < 1 || n > 10) {
        output.textContent = "❌ Please enter a number between 1 and 10!";
        return;
    }

    let pattern = "";
    for (let i = 1; i <= n; i++) {
        pattern += "⭐".repeat(i) + "\n";
    }
    output.textContent = pattern;
}

// ===== 2. QUIZ LOGIC (15 Questions - 3 Levels) =====
const originalQuizData = [
    // ---- EASY LEVEL (5 questions) ----
    {
        level: "Easy",
        question: "What is coding?",
        options: ["Playing games", "Giving instructions to a computer", "Watching TV"],
        answer: 1
    },
    {
        level: "Easy",
        question: "Which language is best for beginners?",
        options: ["Python", "HTML only", "Assembly"],
        answer: 0
    },
    {
        level: "Easy",
        question: "What does a 'loop' do?",
        options: ["Repeats instructions", "Stops the computer", "Deletes files"],
        answer: 0
    },
    {
        level: "Easy",
        question: "Which of these is a programming language?",
        options: ["Python", "Pizza", "Piano"],
        answer: 0
    },
    {
        level: "Easy",
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language"],
        answer: 0
    },

    // ---- MEDIUM LEVEL (5 questions) ----
    {
        level: "Medium",
        question: "Who created Python?",
        options: ["Bill Gates", "Guido van Rossum", "Mark Zuckerberg"],
        answer: 1
    },
    {
        level: "Medium",
        question: "What is a 'bug' in coding?",
        options: ["An insect", "An error in code", "A computer part"],
        answer: 1
    },
    {
        level: "Medium",
        question: "Who invented the World Wide Web?",
        options: ["Tim Berners-Lee", "Steve Jobs", "Elon Musk"],
        answer: 0
    },
    {
        level: "Medium",
        question: "Which language makes websites interactive?",
        options: ["JavaScript", "Python", "Java"],
        answer: 0
    },
    {
        level: "Medium",
        question: "What is a 'variable' in coding?",
        options: ["A box that stores information", "A type of loop", "A computer screen"],
        answer: 0
    },

    // ---- HARD LEVEL (5 questions) ----
    {
        level: "Hard",
        question: "Who wrote the world's first computer program?",
        options: ["Ada Lovelace", "Alan Turing", "Bill Gates"],
        answer: 0
    },
    {
        level: "Hard",
        question: "What does 'CPU' stand for?",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility"],
        answer: 0
    },
    {
        level: "Hard",
        question: "Which of these is NOT a programming language?",
        options: ["Python", "Java", "Photoshop"],
        answer: 2
    },
    {
        level: "Hard",
        question: "What is 'debugging'?",
        options: ["Finding and fixing errors", "Adding new features", "Deleting code"],
        answer: 0
    },
    {
        level: "Hard",
        question: "Who is known as the 'Father of Computer Science'?",
        options: ["Alan Turing", "Charles Babbage", "Steve Wozniak"],
        answer: 0
    }
];

// ===== SHUFFLE FUNCTION (Fisher-Yates Algorithm) =====
function shuffleArray(array) {
    // Create a copy so original stays intact
    let shuffled = [...array];

    // Fisher-Yates shuffle: pick random element and swap
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Shuffle OPTIONS within each question too
function shuffleOptions(question) {
    const correctAnswerText = question.options[question.answer];

    // Shuffle the options
    const shuffledOptions = shuffleArray(question.options);

    // Find new index of correct answer
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);

    return {
        ...question,
        options: shuffledOptions,
        answer: newAnswerIndex
    };
}

// Shuffled quiz data (changes every page load)
let quizData = [];

function prepareQuizData() {
    // Step 1: Shuffle the order of questions
    const shuffledQuestions = shuffleArray(originalQuizData);

    // Step 2: Shuffle options inside each question
    quizData = shuffledQuestions.map(q => shuffleOptions(q));

    console.log("✅ Quiz shuffled! Questions:", quizData.length);
}

// ===== QUIZ STATE =====
let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion() {
    const questionEl = document.getElementById('question');
    if (!questionEl) return;

    const q = quizData[currentQuestion];
    const levelBadge = `<span class="level-badge level-${q.level.toLowerCase()}">${q.level}</span>`;
    questionEl.innerHTML = `${levelBadge} Q${currentQuestion + 1}/${quizData.length}. ${q.question}`;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = "";

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${String.fromCharCode(65 + index)}) ${opt}`;
        btn.onclick = () => selectAnswer(index, btn);
        optionsDiv.appendChild(btn);
    });

    // Update progress bar
    const progress = document.getElementById('progressBar');
    if (progress) {
        progress.style.width = ((currentQuestion / quizData.length) * 100) + "%";
    }

    const counter = document.getElementById('questionCounter');
    if (counter) {
        counter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    }

    document.getElementById('quizFeedback').textContent = "";
    document.getElementById('nextBtn').style.display = "none";
    answered = false;
}

function selectAnswer(selected, btn) {
    if (answered) return;
    answered = true;

    const correct = quizData[currentQuestion].answer;
    const feedback = document.getElementById('quizFeedback');
    const allButtons = document.querySelectorAll('.option-btn');

    allButtons.forEach((b, i) => {
        b.disabled = true;
        if (i === correct) b.classList.add('correct');
    });

    if (selected === correct) {
        score++;
        feedback.textContent = "✅ Correct! Well done!";
        feedback.style.color = "#4caf50";
    } else {
        btn.classList.add('wrong');
        feedback.textContent = "❌ Oops! Correct answer is highlighted.";
        feedback.style.color = "#f44336";
    }

    document.getElementById('nextBtn').style.display = "inline-block";
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quizBox').style.display = "none";
    document.getElementById('resultBox').style.display = "block";

    const finalScore = document.getElementById('finalScore');
    const percentage = Math.round((score / quizData.length) * 100);

    let msg = "";
    let emoji = "";
    if (score === quizData.length) {
        emoji = "🏆";
        msg = "PERFECT! You're a coding genius!";
    } else if (percentage >= 80) {
        emoji = "🌟";
        msg = "Excellent! You really know your stuff!";
    } else if (percentage >= 60) {
        emoji = "👍";
        msg = "Good job! Keep learning and you'll be a pro!";
    } else if (percentage >= 40) {
        emoji = "💪";
        msg = "Not bad! Review the lessons and try again!";
    } else {
        emoji = "📚";
        msg = "Keep practicing! Check the Learn page first!";
    }

    finalScore.innerHTML = `
        ${emoji} You scored <strong>${score}/${quizData.length}</strong> (${percentage}%)<br><br>
        ${msg}
    `;

    const progress = document.getElementById('progressBar');
    if (progress) progress.style.width = "100%";
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;

    // 🔀 RE-SHUFFLE on restart!
    prepareQuizData();

    document.getElementById('quizBox').style.display = "block";
    document.getElementById('resultBox').style.display = "none";
    loadQuestion();
}

// ===== 3. GUESS THE NUMBER GAME =====
let secretNumber = Math.floor(Math.random() * 20) + 1;
let attempts = 5;

function checkGuess() {
    const input = document.getElementById('guessInput');
    if (!input) return;

    const message = document.getElementById('gameMessage');
    const attemptsDisplay = document.getElementById('attemptsLeft');
    const guess = parseInt(input.value);

    if (isNaN(guess) || guess < 1 || guess > 20) {
        message.textContent = "⚠️ Please enter a number between 1 and 20!";
        message.style.color = "#f44336";
        return;
    }

    if (attempts <= 0) {
        message.textContent = `😢 Game over! The number was ${secretNumber}. Click Restart.`;
        message.style.color = "#f44336";
        return;
    }

    attempts--;

    if (guess === secretNumber) {
        message.textContent = `🎉 Correct! You guessed it in ${5 - attempts} tries!`;
        message.style.color = "#4caf50";
        attemptsDisplay.textContent = "";
        attempts = 0;
    } else if (guess < secretNumber) {
        message.textContent = "📉 Too low! Try a higher number.";
        message.style.color = "#ff9800";
        attemptsDisplay.textContent = `Attempts left: ${attempts}`;
    } else {
        message.textContent = "📈 Too high! Try a lower number.";
        message.style.color = "#ff9800";
        attemptsDisplay.textContent = `Attempts left: ${attempts}`;
    }

    if (attempts === 0 && guess !== secretNumber) {
        message.textContent = `😢 Game over! The number was ${secretNumber}. Click Restart.`;
        message.style.color = "#f44336";
        attemptsDisplay.textContent = "";
    }

    input.value = "";
    input.focus();
}

function restartGame() {
    secretNumber = Math.floor(Math.random() * 20) + 1;
    attempts = 5;
    const msg = document.getElementById('gameMessage');
    const att = document.getElementById('attemptsLeft');
    const inp = document.getElementById('guessInput');
    if (msg) msg.textContent = "";
    if (att) att.textContent = "Attempts left: 5";
    if (inp) inp.value = "";
}

// ===== INITIALIZE ON PAGE LOAD =====
window.onload = function () {
    // 🔀 Prepare shuffled quiz data
    prepareQuizData();

    if (document.getElementById('question')) {
        loadQuestion();
    }
    if (document.getElementById('attemptsLeft')) {
        document.getElementById('attemptsLeft').textContent = "Attempts left: 5";
    }
};