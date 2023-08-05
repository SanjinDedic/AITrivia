const API_URL = "http://192.168.0.229:8000";

const rankingTable = document.getElementById("ranking-table");

function updateTable(jsonResponse) {
  console.log(jsonResponse);
  rankingTable.innerHTML = ""; 

  const header = rankingTable.createTHead();
  const headerRow = header.insertRow(0);
  const headerRanking = headerRow.insertCell(0);
  const headerName = headerRow.insertCell(1);
  const headerAnsweredQuestions = headerRow.insertCell(2);
  const headerAttemptedQuestions = headerRow.insertCell(3);
  const headerScore = headerRow.insertCell(4);
  
  headerRanking.innerHTML = "RANK";
  headerName.innerHTML = "TEAM NAME";
  headerAttemptedQuestions.innerHTML = "ATTEMPTED QUESTIONS";
  headerAnsweredQuestions.innerHTML = "ANSWERED QUESTIONS";
  headerScore.innerHTML = "SCORE";
  
  const sortedTeams = jsonResponse.teams.sort((a, b) => b[2] - a[2]).slice(0, 20);

  sortedTeams.forEach((team, index) => {
    let name = team[0];
    let attemptedQuestions = team[3];
    let answeredQuestions = team[4];
    let score = team[2];
    
    const row = rankingTable.insertRow(-1);
    row.style.backgroundColor = team[5]; 
    row.style.color = 'black'; 

    const rankCell = row.insertCell(0);
    rankCell.textContent = index + 1;

    const nameCell = row.insertCell(1);
    nameCell.textContent = name;

    const answeredQuestionsCell = row.insertCell(2);
    answeredQuestionsCell.textContent = answeredQuestions;

    const attemptedQuestionsCell = row.insertCell(3);
    attemptedQuestionsCell.textContent = attemptedQuestions;

    const scoreCell = row.insertCell(4);
    scoreCell.textContent = score;
  });
}

async function fetchDataAndUpdateTable() {
  try {
    const apiUrl =  API_URL +"/get_teams_table";
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    const data = await response.json();
    updateTable(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function updateCurrentTeamName() {
  const currentTeam = localStorage.getItem("currentTeam");
  const teamNameDisplay = document.getElementById("team-name-display");
  if (currentTeam) {
    teamNameDisplay.textContent = `Team: ${currentTeam}`;
  } else {
    teamNameDisplay.textContent = "No team selected";
  }
}

fetchDataAndUpdateTable();
updateCurrentTeamName();

setInterval(() => {
  fetchDataAndUpdateTable();
  updateCurrentTeamName();
}, 5000);
