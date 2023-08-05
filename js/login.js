//const api_url = "https://aitrivia.online/";
const API_URL = "http://192.168.0.229:8000";
async function login() {
    console.log("Login initiated");

    const teamName = document.getElementById("team_name").value;
    console.log("team fetched" + teamName);

    const gameVersion = document.getElementById("login_type").value; // fetch selected game version
    console.log("game version fetched" + gameVersion);
    if (gameVersion === 'basic') {
      endpoint = "/quick_signup"
    }
    if (gameVersion === 'secure') {
      endpoint = "/quick_signup_sec"
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
    const duplicateNameError = document.getElementById("duplicate-name-error");

    if (response.status === 401) {
        console.log("Login failed");
        return;
    }

    if (responseData.message === "Team already exists") {
        duplicateNameError.classList.remove("hidden");
        return;
    } else {
        duplicateNameError.classList.add("hidden");
    }

    localStorage.setItem("access_token", responseData.access_token);
    localStorage.setItem("teamName", teamName); // store teamName in localStorage
    localStorage.setItem("gameVersion", gameVersion); // store game version in localStorage

    console.log("Login successful");
    window.location.href = 'pages/quiz.html';
}
