const userLoginLogo = document.getElementById("userLoginLogo");
const list = document.getElementById("list");
const fullName = document.getElementById("fullName");
// const namesArray = [];
function onPageLoad() {
  domo.get(`/domo/users/v1/${domo.env.userId}?includeDetails=true`)
    .then((response) => {
      let p = document.createElement("h5");
      let firstLetter = "Welcome " + response.displayName.slice(0, 1);
      let textNode = document.createTextNode(firstLetter);
      p.appendChild(textNode);

      let userLoginLogo = document.getElementById("userLoginLogo");
      if (userLoginLogo) {
        userLoginLogo.appendChild(p);
      } else {
        console.error("userLoginLogo element not found");
      }

      console.log(response);
    })
    .catch((error) => {
      console.error("Error fetching user details:", error);
    });
}

window.onload = onPageLoad;


list.addEventListener("click", () => {
  document.getElementById("sliderData").classList.toggle("active")
})

function fetchTeams() {
  domo.get(`/domo/datastores/v1/collections/ticketingApp/documents`)
    .then(response => {
      console.log(response);
      displayTeams(response);
    })
}

function displayTeams(teams) {
  const teamList = document.getElementById('teamList');
  teamList.innerHTML = '';
  teams.forEach(team => {
        const teamName = team.content.teamName;
        const members = team.content.selectedNames.join(", "); // Assuming selectedNames is an array of member names

        const row = document.createElement("tr");
        const teamNameCell = document.createElement("td");
        const membersCell = document.createElement("td");

        teamNameCell.textContent = teamName;
        membersCell.textContent = members;

        row.appendChild(teamNameCell);
        row.appendChild(membersCell);

        teamTableBody.appendChild(row);
    });
}

fetchTeams();