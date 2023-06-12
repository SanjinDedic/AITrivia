import { submitAnswer, showResult  } from './quiz-controller.js';

let countdownTimer;

function displayQuestion(index, questions) {
    const question = questions[index];
    if (index >= questions.length) {
        showResult();
        return;
    }
    const questionPoints = question.points;
    const formattedQuestion = `<b>For ${questionPoints} pts</b>: ${question.question}`;
    document.getElementById("question").innerHTML = formattedQuestion;
    const questionImage = document.getElementById("question-image");

    if (question.image_link) {
        questionImage.src = question.image_link;
        questionImage.style.display = "block";
    } else {
        questionImage.style.display = "none";
    }

    if (question.type === 'multiple_choice') {
        document.getElementById("multiple_choice_options").classList.remove('hidden');
        document.getElementById("short_answer_input").classList.add('hidden');
        document.getElementById("option-a").innerText = question.options[0];
        document.getElementById("option-b").innerText = question.options[1];
        document.getElementById("option-c").innerText = question.options[2];
        document.getElementById("option-d").innerText = question.options[3];
    } else if (question.type === 'short_answer') {
        document.getElementById("multiple_choice_options").classList.add('hidden');
        document.getElementById("short_answer_input").classList.remove('hidden');
        document.getElementById("short_answer").value = "";
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
}

function startCountdown(index, questions) {
    if (index >= questions.length) {return;} // dont countdown if quiz finished
    let timeLeft;
    if (questions[index].type === 'multiple_choice') {
        timeLeft = 15;
    } else if (questions[index].type === 'short_answer') {
        timeLeft = 30;
    }
    document.getElementById("countdown-display").innerText = `Time left: ${timeLeft}`;

    countdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("countdown-display").innerText = `Time left: ${timeLeft}`;

        if (timeLeft === 0) {
            clearInterval(countdownTimer);
            submitAnswer(true);  // forced submission due to timer
        }
    }, 1000);
}

export { displayQuestion, startCountdown};
