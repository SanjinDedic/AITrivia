here is my HTML:

<body>
  <nav class="navbar">
    <a href="index.html">Reset</a>
    <a href="pages/rankings.html">Basic Rankings</a>
    <a href="pages/sec_rankings.html">Secure Rankings</a>
    <a href="pages/about.html" target="_blank">About</a>
  </nav>
  <div class="main-container">
    <div class="container" id="login-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin-right: 10px;">Your Name:</h1>
            <input type="text" id="team_name" style="width: 50%; padding: 6px 12px; margin: 4px 0; box-sizing: border-box; font-size: 18px;">
          </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin-right: 10px;">Game Version:</h1>
        <select id="login_type" style="width: 50%; padding: 6px 12px; margin: 4px 0; box-sizing: border-box; font-size: 18px;">
          <option value="basic">Basic</option>
          <option value="secure">Secure</option>
        </select>
      </div>
      <button onclick="signin()">Login</button>
      <p id="dup_message" class="hidden" style="color: red; font-size: 24px;">Invalid Login Credentials</p>
      <p id="ip_message" class="hidden" style="color: red; font-size: 24px;">Another team registered with your IP</p>
      <p id="login-error" class="hidden"></p>
    </div>
  </div>
  <script src="js/login.js"></script>
</body>
</html>


here is my JS


const API_URL = "https://aitrivia.online";

async function login() {
    console.log("Login initiated");

    const teamName = document.getElementById("team_name").value;
    console.log("team fetched" + teamName);

    const gameVersion = document.getElementById("login_type").value;
    console.log("game version fetched" + gameVersion);

    let endpoint = "";
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



here is my API endpoint


@app.post("/quick_signup_sec")
async def quick_signup(team: QuickSignUp, request: Request, Authorize: AuthJWT = Depends()):
    team_color = random_color()
    print("team color", team_color)
    # Get client IP address
    client_ip = request.client.host
    print("client ip", client_ip)
    existing_team = execute_db_query("SELECT * FROM teams WHERE name = ?", (team.name,), fetchone=True, db="comp.db")
    if existing_team is not None:
        return {"message": "Team already exists"}
    #check if there is another team with the same IP
    existing_team = execute_db_query("SELECT * FROM teams WHERE ip = ?", (client_ip,), fetchone=True, db="comp.db")
    if existing_team is not None:
        return {"message": "Another team already exists with the same IP address"}
    print("team about to be created")
    # Create a new team and include the IP address
    execute_db_query("INSERT INTO teams (name, ip, score, attempted_questions, solved_questions, color) VALUES (?, ?, ?, ?, ?, ?)", (team.name, client_ip, 0, 0, 0, team_color), db="comp.db")

    access_token = Authorize.create_access_token(subject=team.name)
    return {"access_token": access_token}



I would like you to completely re write the JS file so that it exhibits this behaviour

1. if the user enters a team with an IP that is already in the database this element becomes visible
<p id="ip_message" class="hidden" style="color: red; font-size: 24px;">Another team registered with your IP</p>

2. if the user enters a team with a name that is already in the database this element becomes visible
<p id="dup_message" class="hidden" style="color: red; font-size: 24px;">Invalid Login Credentials</p>

3. If the user enters a unique team name using a unique IP then they are redirected to this page

    window.location.href = 'pages/quiz.html';

respond only with a complete new JS file in a code block