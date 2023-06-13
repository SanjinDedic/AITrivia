//gets questions from json this happens only once
async function fetchQuestions(url = 'questions.json') {
    console.log("fetching questions");
    try {
        const response = await fetch(url);
        const data = await response.json();
        const last100Questions = data.slice(-100);
        const shuffledQuestions = shuffleArray(last100Questions).slice(0, 5);
        return { shuffledQuestions };
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}
//shuffles questions
function shuffleArray(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}

export { fetchQuestions, shuffleArray};