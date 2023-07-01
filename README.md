# Science and Tech Trivia

This is a web-based Science and Tech Trivia Quiz game built using HTML, CSS, and JavaScript. Users can compete with each other by answering multiple-choice or short-answer questions related to science and technology. The ranking table displays the real-time ranking of teams based on their scores. **Live Site: https://aitrivia.live/**

## Project Structure

```
├── css
│   ├── main.css
│   └── rankings.css
├── js
│   ├── main.js
│   └── rankings.js
├── pages
│   ├── about.html
│   └── rankings.html
├── index.html
└── README.md
```
### <b>index.html</b>
The main HTML file for the Science and Tech Trivia game. It includes the login form, navigation bar, and quiz container. The quiz container contains questions, answer options, and a countdown timer. The file also links to the necessary CSS and JavaScript files.

### <b>pages/rankings.html</b>
This HTML file displays the ranking table, showing the real-time scores and rankings of all participating teams. It includes the navigation bar and links to the necessary CSS and JavaScript files.

### <b>css/main.css</b>
This file contains the primary CSS styles for the <b>index.html</b> page.

### <b>css/rankings.css</b>
This file contains the CSS styles specifically for the <b>rankings.html</b> page.

### <b>js/main.js</b>
The main JavaScript file containing the core functionality of the game, including fetching questions, displaying questions, submitting answers, and managing the countdown timer. It also includes the login function for user authentication.

### <b>js/rankings.js</b>
This JavaScript file is responsible for fetching the team rankings from the server and updating the ranking table on the <b>rankings.html</b> page.

## Usage

To play the game, open the <b>index.html</b> file in a web browser. Enter your team name and click the "Login" button. Once logged in, you will be presented with a series of questions. Answer the questions within the given time limit. At the end of the quiz, you will be redirected to the <b>rankings.html</b> page, where you can view your team's ranking.

## License
This project is licensed under the MIT License.
