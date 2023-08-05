const API_URL = "http://192.168.0.229:8000";

const rankingTable = document.getElementById("ranking-table");

function updateTable(jsonResponse) {
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
  headerAnsweredQuestions.innerHTML = "ANSWERED QUESTIONS";
  headerAttemptedQuestions.innerHTML = "ATTEMPTED QUESTIONS";
  headerScore.innerHTML = "SCORE";

  const sortedTeams = jsonResponse.teams.sort((a, b) => b[1] - a[1]).slice(0, 20);

  sortedTeams.forEach((team, index) => {
    const row = rankingTable.insertRow(-1);
    row.style.backgroundColor = team[4]; 
    row.style.color = 'black'; 

    const rankCell = row.insertCell(0);
    rankCell.textContent = index + 1;

    const nameCell = row.insertCell(1);
    nameCell.textContent = team[0];

    const answeredQuestionsCell = row.insertCell(2);
    answeredQuestionsCell.textContent = team[3];

    const attemptedQuestionsCell = row.insertCell(3);
    attemptedQuestionsCell.textContent = team[2];

    const scoreCell = row.insertCell(4);
    scoreCell.textContent = team[1];
  });
}

async function fetchDataAndUpdateTable() {
  try {
    const apiUrl =  API_URL +"/get_comp_table";
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    const data = await response.json();
    console.log(data)
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
