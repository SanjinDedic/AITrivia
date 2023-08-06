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
