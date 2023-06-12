import { fetchQuestions, shuffleArray } from './startup.js';
import { displayQuestion, startCountdown } from './question-display.js';
//import { updateScoreDisplay, showResult } from './score-handler.js';

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let maxScore = 0;

const startQuiz = async () => {
    console.log('startQuiz');
    const { shuffledQuestions } = await fetchQuestions();
    questions = shuffledQuestions;
    displayQuestion(currentQuestionIndex, questions); 
    updateScoreDisplay();
    startCountdown(currentQuestionIndex, questions);
};


async function submitAnswer(forceSubmit = false) {
    if (currentQuestionIndex >= questions.length) {return;}
    console.log('submitAnswer');
    const teamName = localStorage.getItem("teamName");
    const id = questions[currentQuestionIndex].id.toString(10);
    console.log(teamName, id);
    let answer;

    if (questions[currentQuestionIndex].type === 'multiple_choice') {
        if (forceSubmit) {
            answer = 'x';
            console.log('ABOUT TO SUMBIT THIS', answer);
        } else {
            const selectedOption = document.querySelector('input[name="option"]:checked');
            if (!selectedOption) return;
            answer = selectedOption.value;
            console.log('ABOUT TO SUMBIT THIS', answer);
        }
    } else if (questions[currentQuestionIndex].type === 'short_answer') {
        answer = document.getElementById("short_answer").value.trim();
    }

    const response = await fetch('https://aitrivia.online/submit_answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
        },
        body: JSON.stringify({
            "id": id,
            "answer": answer,
            "team_name": teamName,
            "table": "grokkers"
        }),
    });

    const responseData = await response.json();
    console.log("Response data:", responseData);

    const resultDisplay = document.getElementById("result-display");
    const resultMessage = document.getElementById("result-message");
    const correctAnswer = document.getElementById("correct-answer");
    const questionContainer = document.querySelector('.question-container');

    if (responseData.message && responseData.message.includes("Correct")) {
        console.log("Answer is correct");
        score += questions[currentQuestionIndex].points;
        updateScoreDisplay();
        resultDisplay.classList.remove('hidden');
        resultMessage.innerText = 'Correct!';
        correctAnswer.innerText = '';
        questionContainer.classList.add('hidden');
    } else {
        console.log("Answer is incorrect");
        resultDisplay.classList.remove('hidden');
        resultMessage.innerText = 'Incorrect!';
        //if the response.Data.correct_answer is 1 char long then display the correct answer
        if (responseData.correct_answer.length === 1) {
            console.log("attempting to get the accurate MCQ " );
            if (responseData.correct_answer === "a") {
                correctAnswer.innerText = 'The correct answer was: ' + responseData.correct_answer + ': ' + questions[currentQuestionIndex].options[0];
            }
            if (responseData.correct_answer === "b") {
                correctAnswer.innerText = 'The correct answer was: ' + responseData.correct_answer + ': ' + questions[currentQuestionIndex].options[1];
            }
            if (responseData.correct_answer === "c") {
                correctAnswer.innerText = 'The correct answer was: ' + responseData.correct_answer + ': ' + questions[currentQuestionIndex].options[2];
            }
            if (responseData.correct_answer === "d") {
                correctAnswer.innerText = 'The correct answer was: ' + responseData.correct_answer + ': ' + questions[currentQuestionIndex].options[3];
            }
        } else {
            correctAnswer.innerText = 'The correct answer was: ' + responseData.correct_answer;
        }

        questionContainer.classList.add('hidden');
    }

    setTimeout(function() {
        resultDisplay.classList.add('hidden');
        questionContainer.classList.remove('hidden');
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex,questions);
        startCountdown(currentQuestionIndex,questions);
    }, 3000); // 3000ms (3 seconds) delay before showing next question
}



document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#submit-button").onclick = () => submitAnswer();;
});


function showResult() {
    const maxScore = questions.reduce((total, question) => total + question.points, 0);
    document.querySelector('.question-container').classList.add('hidden');
    document.getElementById("result").innerText = `Your score: ${score}/${maxScore}`;
    document.getElementById("result").classList.remove('hidden');
    setTimeout(() => {
        let baseurl;
        if (window.location.hostname === "sanjin84.github.io") {
            baseurl = "/AITrivia";
        } else {
            baseurl = "";
        }
        window.location.href = `${baseurl}/pages/rankings.html`;
    }, 8000); // 5000ms (5 seconds) delay before redirecting
}


// Update the displayed score
function updateScoreDisplay() {
    document.getElementById("score-display").innerText = `Score: ${score}`;
}

startQuiz();

export { submitAnswer, showResult, updateScoreDisplay };