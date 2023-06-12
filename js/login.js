async function login() {
    console.log("Login initiated");
    const teamName = document.getElementById("team_name").value;
    console.log("team fetched");
    const response = await fetch("https://aitrivia.online/quick_signup", {
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
    console.log("Login successful");
    window.location.href = 'pages/quiz.html';
}
