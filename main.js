const container = document.querySelector('.container');
const backgroundImage = document.querySelector('.backgroundImage');
const contentStartContainer = container.querySelector("[data-question='start']");
const startButton = container.querySelector("[data-button='start']");
const restartButton = container.querySelector("[data-button='restart']");
const questionElement = container.querySelector("[data-question='question']");
const nextButton = container.querySelector("[data-button='next']");
const circleContainer = container.querySelector('.circle__container');
const resultSubheading = container.querySelector("[data-question='result-subheading']");
const layouts = ['start', 'question', 'answer', 'result'];
let answers = [];
let questions;

let shuffledQuestions, currentQuestionIndex;


// Fetching Data 
function fetchData() {
    fetch('./questions.json')
    .then((response) =>  response.json())
    .then((data) => {
        questions = data;
    })
    .catch(error => {
        console.log(error);
    });
}


// App Initialization
function initApp() {
    fetchData();
    container.classList.add('startLayout');
}

// Switch Layout 
function switchLayout(layoutName) {
    layouts.forEach(layout => container.classList.remove(layout + 'Layout'));
    container.classList.add(layoutName + 'Layout');
}

// Set Next Question
function setNextQuestion() {
    resetState();
    if (answers.length < 3) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
        changeBackground(answers.length + 1);
    }
    else {
        showResults();
        changeBackground(4);
        switchLayout('result');
    }
}



// Start Game
function startGame() {
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    answers = [];
    generateStatus();
    switchLayout('question');
    setNextQuestion();
}

function restartGame() {
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    switchLayout('question');
    setNextQuestion();
}

// Show question
function showQuestion(question) {
    questionElement.innerHTML = question.question;

    question.asnwers.forEach(answer => {
        const optionContainer = document.querySelector("[data-question='options']");
        const questionCard = document.querySelector("[data-question='card-container']");

        questionCard.innerHTML += ` 
        <div class="questionCard questionCard--${answer.correct}">
            <div class="questionCard__heading questionCard__heading--${answer.correct}">${answer.correct}</div>
            <!--questionCard__heading-->
            <div class="questionCard__copy">
                <div>${question.explanation}</div>
            </div>
            <!--questionCard__copy-->
        </div>
        <!--questionCard-->
    `;

        optionContainer.innerHTML += `
        <div class="option">
            <div class="option__inner option__inner--primary" data-correct="${answer.correct}">
                <div class="option__value" data-correct="${answer.correct}">${answer.text}</div> <!--option__value-->
            </div>
            <div class="option__inner option__inner--secondary">
            <div class="option__bar option__bar--${answer.correct}" style="width: ${answer.percentage}%"></div>
        </div>
            <!--option__inner-->
            <div class="option__text">${answer.percentage}% allert Spieler lagen ${answer.correct}</div>
            <!--option-->
        </div>
    `;

        const options = document.querySelectorAll('.option__inner--primary');
        options.forEach(option => option.addEventListener('click', selectAnswer));
    });
}

// Change Background 
function changeBackground(index) {
    let questionUrl = `url(./images/lh-${index}.jpg)`;
    let resultUrl = `url(./images/bg_home.jpg)`;
    if (index === 4) {
        backgroundImage.style.backgroundImage = resultUrl;
    } else {
        backgroundImage.style.backgroundImage = questionUrl;
    }
}


// Select Answer
function selectAnswer(e) {
    const selectedOption = e.target;
    const correct = selectedOption.dataset.correct;
    const questionCardContainer = document.querySelector("[data-question='card-container']");
    answers.push(selectedOption.dataset.correct);
    showAnswer();
    updateStatus();
    setStatusClass(questionCardContainer, correct);
}

// Show Answer
function showAnswer() {
    switchLayout('answer');
}

// Generate Status
function generateStatus() {
    circleContainer.innerHTML = `
        <div class="circle"></div>
        <!--circle-->
        <div class="circle"></div>
        <!--circle-->
        <div class="circle"></div>
        <!--circle-->
    `;
}

// Set Status Class
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct === "richtig") {
        element.classList.add('questionCard__container--richtig');
    } else {
        element.classList.add('questionCard__container--falsch');
    }
}

// Update Status
function updateStatus() {
    answers.forEach((answer, index) => {
        if (answer === 'richtig') {
            circleContainer.children[index].classList.remove('circle--wrong');
            circleContainer.children[index].classList.add('circle--success');
        }
        else {
            circleContainer.children[index].classList.remove('circle--success');
            circleContainer.children[index].classList.add('circle--wrong');
        }
    });
}

function clearStatusClass(element) {
    element.classList.remove('questionCard__container--richtig');
    element.classList.remove('questionCard__container--falsch');
}

// Reset State
function resetState() {
    const optionContainer = document.querySelector("[data-question='options']");
    const questionCardContainer = document.querySelector("[data-question='card-container']");
    clearStatusClass(questionCardContainer);
    optionContainer.innerHTML = "";
    questionCardContainer.innerHTML = "";
    switchLayout('question');
}

//Results 
function showResults() {
    let countObject = {};
    answers.forEach((i) => countObject[i] = (countObject[i] || 0) + 1);
    let result = countObject.richtig;

    if (result === undefined) {
        resultSubheading.innerHTML = `Your result is 0, you need to travel more!`;
    } else {
        resultSubheading.innerHTML = `Congratulations, you answered ${result} questions correctly!`
    }
}


// Event Listeners
window.addEventListener('load', () => {
    initApp();
});
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});