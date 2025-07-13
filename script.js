// Quiz Data
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correct: 1
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    }
];

// Quiz State
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let answered = false;

// DOM Elements
const questionEl = document.getElementById('question');
const optionsEls = [
    document.getElementById('option1'),
    document.getElementById('option2'),
    document.getElementById('option3'),
    document.getElementById('option4')
];
const radioInputs = document.querySelectorAll('input[name="answer"]');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const feedbackEl = document.getElementById('feedback');
const scoreAreaEl = document.getElementById('showScore');
const questionNumberEl = document.getElementById('questionNumber');
const totalQuestionsEl = document.getElementById('totalQuestions');
const progressBar = document.getElementById('progressBar');
const finalScoreEl = document.getElementById('finalScore');
const totalScoreEl = document.getElementById('totalScore');
const scoreMessageEl = document.getElementById('scoreMessage');
const correctCountEl = document.getElementById('correctCount');
const incorrectCountEl = document.getElementById('incorrectCount');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restartBtn');
const questionContainer = document.querySelector('.question-container');

// Initialize Quiz
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    answered = false;
    
    // Reset UI
    scoreAreaEl.style.display = 'none';
    questionContainer.style.display = 'block';
    feedbackEl.style.display = 'none';
    
    // Set total questions
    totalQuestionsEl.textContent = `of ${quizData.length}`;
    totalScoreEl.textContent = quizData.length;
    
    loadQuestion();
}

// Load Current Question
function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        showResults();
        return;
    }
    
    const current = quizData[currentQuestion];
    answered = false;
    
    // Update question number and progress
    questionNumberEl.textContent = `Question ${currentQuestion + 1}`;
    updateProgressBar();
    
    // Clear previous selections
    radioInputs.forEach(radio => {
        radio.checked = false;
    });
    
    // Hide feedback and buttons
    feedbackEl.style.display = 'none';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
    submitBtn.disabled = false;
    
    // Load question and options with animation
    questionEl.style.opacity = '0';
    setTimeout(() => {
        questionEl.textContent = current.question;
        questionEl.style.opacity = '1';
    }, 150);
    
    // Load options with staggered animation
    optionsEls.forEach((option, index) => {
        option.style.opacity = '0';
        setTimeout(() => {
            option.textContent = current.options[index];
            option.style.opacity = '1';
        }, 200 + (index * 100));
    });
}

// Update Progress Bar
function updateProgressBar() {
    const progress = (currentQuestion / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Check Answer
function checkAnswer() {
    if (answered) return;
    
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert('Please select an answer!');
        return;
    }
    
    const userAnswer = parseInt(selectedOption.value);
    const correctAnswer = quizData[currentQuestion].correct;
    
    answered = true;
    userAnswers.push(userAnswer);
    
    // Disable submit button
    submitBtn.disabled = true;
    
    // Show feedback
    showFeedback(userAnswer === correctAnswer, correctAnswer);
    
    // Update score
    if (userAnswer === correctAnswer) {
        score++;
    }
    
    // Show next button or finish
    if (currentQuestion < quizData.length - 1) {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    } else {
        setTimeout(() => {
            showResults();
        }, 2000);
    }
}

// Show Feedback
function showFeedback(isCorrect, correctAnswer) {
    feedbackEl.style.display = 'block';
    feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isCorrect) {
        feedbackEl.textContent = '🎉 Correct! Well done!';
        addCorrectAnswerEffect();
    } else {
        feedbackEl.textContent = `❌ Incorrect. The correct answer is: ${quizData[currentQuestion].options[correctAnswer]}`;
        addIncorrectAnswerEffect();
    }
}

// Add visual effects for correct answer
function addCorrectAnswerEffect() {
    const selectedLabel = document.querySelector('input[name="answer"]:checked + label');
    if (selectedLabel) {
        selectedLabel.style.animation = 'correctPulse 0.6s ease-out';
    }
}

// Add visual effects for incorrect answer
function addIncorrectAnswerEffect() {
    const selectedLabel = document.querySelector('input[name="answer"]:checked + label');
    const correctLabel = document.querySelector(`input[value="${quizData[currentQuestion].correct}"] + label`);
    
    if (selectedLabel) {
        selectedLabel.style.animation = 'incorrectShake 0.6s ease-out';
        selectedLabel.style.background = '#dc3545';
    }
    
    if (correctLabel) {
        correctLabel.style.animation = 'correctPulse 0.6s ease-out';
        correctLabel.style.background = '#28a745';
        correctLabel.style.color = 'white';
    }
}

// Next Question
function nextQuestion() {
    currentQuestion++;
    
    // Reset option styles
    optionsEls.forEach(option => {
        const label = option.parentElement.querySelector('label');
        label.style.animation = '';
        label.style.background = '';
        label.style.color = '';
    });
    
    loadQuestion();
}

// Show Results
function showResults() {
    questionContainer.style.display = 'none';
    scoreAreaEl.style.display = 'block';
    
    // Update progress to 100%
    progressBar.style.width = '100%';
    
    // Calculate stats
    const correctCount = score;
    const incorrectCount = quizData.length - score;
    const accuracy = Math.round((score / quizData.length) * 100);
    
    // Update score display
    finalScoreEl.textContent = score;
    correctCountEl.textContent = correctCount;
    incorrectCountEl.textContent = incorrectCount;
    accuracyEl.textContent = `${accuracy}%`;
    
    // Set score message
    let message = '';
    if (accuracy >= 80) {
        message = '🏆 Excellent! You\'re a quiz master!';
    } else if (accuracy >= 60) {
        message = '👍 Good job! Keep it up!';
    } else if (accuracy >= 40) {
        message = '📚 Not bad! Keep learning!';
    } else {
        message = '💪 Don\'t give up! Practice makes perfect!';
    }
    
    scoreMessageEl.textContent = message;
    
    // Animate score
    animateScore();
}

// Animate Score Counter
function animateScore() {
    let currentScore = 0;
    const increment = score / 20;
    
    const counter = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(counter);
        }
        finalScoreEl.textContent = Math.floor(currentScore);
    }, 50);
}

// Restart Quiz
function restartQuiz() {
    // Reset all option styles
    optionsEls.forEach(option => {
        const label = option.parentElement.querySelector('label');
        label.style.animation = '';
        label.style.background = '';
        label.style.color = '';
    });
    
    initQuiz();
}

// Event Listeners
submitBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Enable submit button when option is selected
radioInputs.forEach(radio => {
    radio.addEventListener('change', () => {
        if (!answered) {
            submitBtn.disabled = false;
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !answered && document.querySelector('input[name="answer"]:checked')) {
        checkAnswer();
    } else if (e.key === 'Enter' && answered && nextBtn.style.display !== 'none') {
        nextQuestion();
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes correctPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); background: #28a745; }
        100% { transform: scale(1); background: #28a745; }
    }
    
    @keyframes incorrectShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the quiz when page loads
document.addEventListener('DOMContentLoaded', initQuiz);