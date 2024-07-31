const loadingElement = document.getElementById('loading');
const showLoading = () => {
  loadingElement.style.display = 'block';
};
const hideLoading = () => {
  loadingElement.style.display = 'none';
};

const loadElement = document.getElementById('load');
const showLoad = () => {
  loadElement.style.display = 'block';
};
const hideLoad = () => {
  loadElement.style.display = 'none';
};

const list = document.getElementById("list");
list.addEventListener("click", () => {
  document.getElementById("sliderData").classList.toggle("active")
})
showLoading()
function fetchTeams() {
  domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/`)
    .then(response => {
      console.log(response);
      displayTeams(response);
      hideLoading()
    })
}
fetchTeams();
function displayTeams(teams) {
  const head = document.querySelector('#teamList #head');
  const headTr = document.createElement("tr");

  const teamNameHead = document.createElement("th");
  const membersCellHead = document.createElement("th");

  teamNameHead.textContent = "Team Name";
  membersCellHead.textContent = "People";

  headTr.appendChild(teamNameHead)
  headTr.appendChild(membersCellHead)

  head.appendChild(headTr)

  const body = document.querySelector("#teamList #body");
  console.log(teams);
  teams.forEach(team => {
    if (team.content.hasOwnProperty('teamName')) {    // validating the teamName from AppDB
      const teamName = team.content.teamName;
      const members = team.content.selectedNames.join(", ");

      const row = document.createElement("tr");

      // Creating a table data to store the value
      const teamNameCell = document.createElement("td");
      const membersCell = document.createElement("td");
      const editTd = document.createElement("td")
      const deleteTd = document.createElement("td");

      // Creating Edit and Delete button
      const editBtn = document.createElement("a");
      const deleteBtn = document.createElement("a");

      // Assigning the values
      teamNameCell.textContent = teamName;
      membersCell.textContent = members;

      const editIcon = document.createElement('i');
      editIcon.className = 'fas fa-edit';
      editIcon.addEventListener("click", () => {
        // It will navigate to the create team page with existing value
        window.location.href = `createTeam.html?id=${team.id}`;
      })

      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fas fa-trash';
      deleteIcon.addEventListener("click", () => {
        // Getting conformation before deleting the data
        const conDiv = document.querySelector(".conDiv");
        conDiv.style.display = "block";

        const yes = document.getElementById("yes")
        const no = document.getElementById("no")

        const handleYes = ()=>{
          showLoad()
          domo.delete(`/domo/datastores/v1/collections/ticketingApp/documents/${team.id}`)
          .then(()=>{
            row.remove();
            hideLoad()
            conDiv.style.display = "none";
            yes.removeEventListener("click", handleYesClick);
            no.removeEventListener("click", handleNoClick);
          })
        }
        const handleNo = ()=>{
          conDiv.style.display = "none";
          yes.removeEventListener("click", handleYesClick);
          no.removeEventListener("click", handleNoClick);
        }
        
        yes.addEventListener("click", handleYes)
        no.addEventListener("click", handleNo)
      })

      editBtn.appendChild(editIcon);
      deleteBtn.appendChild(deleteIcon);

      editTd.appendChild(editBtn);
      deleteTd.appendChild(deleteBtn);

      row.appendChild(teamNameCell);
      row.appendChild(membersCell);
      row.appendChild(editTd);
      row.appendChild(deleteTd);

      body.appendChild(row);
    } else {
      console.log("Error: In AppDB Null values are present");
    }
  });
}