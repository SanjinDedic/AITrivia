let score = 0;

function showResult(questions, score) {
    const maxScore = questions.reduce((total, question) => total + question.points, 0);
    document.querySelector('.question-container').classList.add('hidden');
    document.getElementById("result").innerText = `Your score: ${score}/${maxScore}`;
    document.getElementById("result").classList.remove('hidden');
    setTimeout(() => {
        //if the game is secure then redirect to the /pages/sec_rankings.html otherwise redirect to /pages/rankings.html
        if (localStorage.getItem("gameVersion") === "secure") {
            window.location.href = '../pages/sec_rankings.html';
        } else {
            window.location.href = '../pages/rankings.html';
        }
    }, 8000); // 5000ms (5 seconds) delay before redirecting
}


// Update the displayed score
function updateScoreDisplay(score) {
    document.getElementById("score-display").innerText = `Score: ${score}`;
}

export { updateScoreDisplay, showResult };