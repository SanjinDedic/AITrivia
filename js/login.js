//const API_URL = "http://192.168.0.229:8000";
const API_URL = "https://aitrivia.online";

async function login() {
    console.log("Login initiated");

    const teamName = document.getElementById("team_name").value;
    console.log("team fetched" + teamName);

    const gameVersion = document.getElementById("login_type").value;
    console.log("game version fetched" + gameVersion);

    let endpoint = "/quick_signup_sec";
    if (gameVersion === 'basic') {
        endpoint = "/quick_signup";
    } else if (gameVersion === 'secure') {
        endpoint = "/quick_signup_sec";
    }

    const response = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: teamName
        }),
    });

    const responseData = await response.json();
    console.log("Response arrived");
    console.log(responseData);

    const duplicateNameError = document.getElementById("dup_message");
    const ipMessage = document.getElementById("ip_message");

    if (duplicateNameError) {
        duplicateNameError.classList.add("hidden");
    }
    
    if (ipMessage) {
        ipMessage.classList.add("hidden");
    }

    if (response.status === 401) {
        console.log("Login failed");
        return;
    }

    if (responseData.message === "Team already exists" && duplicateNameError) {
        duplicateNameError.classList.remove("hidden");
        return;
    } else if (responseData.message === "Another team already exists with the same IP address" && ipMessage) {
        ipMessage.classList.remove("hidden");
        return;
    }

    localStorage.setItem("access_token", responseData.access_token);
    localStorage.setItem("teamName", teamName);
    localStorage.setItem("gameVersion", gameVersion);

    console.log("Login successful");
    window.location.href = 'pages/quiz.html';
}


document.addEventListener('DOMContentLoaded', function() {
    const serverMarker = document.getElementById('server-marker');
    serverMarker.addEventListener('click', function(event) {
        event.preventDefault();
        sendApiRequest();
    });

    if (localStorage.getItem('countdownEndTime')) {
        runCountdown();
        serverMarker.textContent = 'Server Running';
        serverMarker.classList.add('heartbeat');
    }
});

function sendApiRequest() {
    
    fetch('https://70b6f68hy8.execute-api.ap-southeast-2.amazonaws.com/test/startinstance?instance=trivia&time=30', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Additional headers
        }
    })
    .then(response => {
        if (response.ok) {  // Check if the response status is 200 (HTTP OK)
            return response.json();  // Parse JSON body
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        console.log(data);
        startCountdown(1800); // Start countdown for 30 minutes (1800 seconds)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    
}

function startCountdown(duration) {
    const endTime = new Date().getTime() + duration * 1000;
    localStorage.setItem('countdownEndTime', endTime);
    updateServerMarker(true);
    runCountdown();
    
}

function runCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    const endTime = localStorage.getItem('countdownEndTime');
    let timeLeft = (endTime - new Date().getTime()) / 1000;

    countdownElement.style.display = 'inline'; // Show the countdown

    const interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);
            updateServerMarker(false);
            countdownElement.style.display = 'none';
            localStorage.removeItem('countdownEndTime'); // Clear the stored end time
        } else {
            timeLeft = (endTime - new Date().getTime()) / 1000;
            countdownElement.textContent = formatTime(timeLeft);
        }
    }, 1000);
}

function formatTime(seconds) {
    seconds = Math.max(seconds, 0); // Ensure seconds doesn't go negative
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
}

function pad(number) {
    return number.toString().padStart(2, '0');
}


function updateServerMarker(isRunning) {
    const serverMarker = document.getElementById('server-marker');
    if (isRunning) {
        serverMarker.textContent = '● Server Running';
        serverMarker.classList.add('heartbeat');
    } else {
        serverMarker.textContent = 'Server Launch';
        serverMarker.classList.remove('heartbeat');
    }
}