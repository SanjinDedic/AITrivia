console.log('made it to comp-controller.js');
import { fetchQuestions, shuffleArray } from '/js/startup.js';
import { displayQuestion } from '/js/question-display.js';
import { updateScoreDisplay, showResult } from './score-handler.js';

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let maxScore = 0;

const startQuiz = async () => {
    console.log('startQuiz');
    const { shuffledQuestions } = await fetchQuestions();
    questions = shuffledQuestions;
    displayQuestion(currentQuestionIndex, questions, score); 
    updateScoreDisplay(score);
    document.getElementById("next-button").disabled = questions.length <= 1;
    document.getElementById("previous-button").disabled = true;
};

async function submitAnswer(forceSubmit = false, db = "trivia.db") {
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
            "db": db
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
        updateScoreDisplay(score);
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
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#submit-button").onclick = () => submitAnswer(db="comp.db");
    document.querySelector("#next-button").onclick = () => navigateQuestion(1);
    document.querySelector("#previous-button").onclick = () => navigateQuestion(-1);
});

function navigateQuestion(direction) {
    currentQuestionIndex += direction;
    displayQuestion(currentQuestionIndex, questions, score);
    document.getElementById("next-button").disabled = currentQuestionIndex >= questions.length - 1;
    document.getElementById("previous-button").disabled = currentQuestionIndex <= 0;
}

startQuiz();

export { submitAnswer };
