const userLoginLogo = document.getElementById("userLoginLogo");
const list = document.getElementById("list");
const fullName = document.getElementById("fullName");

document.addEventListener("DOMContentLoaded", () => {
  // It will reload the page
  if (!sessionStorage.getItem('reloaded')) {
    sessionStorage.setItem('reloaded', 'true');
    location.reload();
  }
})

list.addEventListener("click", () => {
  document.getElementById("sliderData").classList.toggle("active")
})

function fetchTeams() {
  domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/`)
    .then(response => {
          console.log(response);
          displayTeams(response);
    })
}

function displayTeams(teams) {
  const body = document.querySelector("#teamList #body");
  console.log(teams);
  teams.forEach(team => {
      if(team.content.hasOwnProperty('teamName'))
      {  
        const teamName = team.content.teamName;
        const members = team.content.selectedNames.join(", ");
        // let sno = 1;
        const row = document.createElement("tr");
        // const slno = document.getElementById("td");
        const teamNameCell = document.createElement("td");
        const membersCell = document.createElement("td");
        const editTd = document.createElement("td")
        const deleteTd = document.createElement("td");

        const editBtn = document.createElement("a");
        const deleteBtn = document.createElement("a");
        // slno.textContent = sno;
        teamNameCell.textContent = teamName;
        membersCell.textContent = members;

        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editIcon.addEventListener("click",()=>{
          window.location.href = `createTeam.html?id=${team.id}`;
        })

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteIcon.addEventListener("click",()=>{
          domo.delete(`/domo/datastores/v1/collections/ticketingApp/documents/${team.id}`);
          alert("Team Deleted")
          location.reload();
        })

        editBtn.appendChild(editIcon);
        deleteBtn.appendChild(deleteIcon);
        
        editTd.appendChild(editBtn);
        deleteTd.appendChild(deleteBtn);
        // row.appendChild(slno);
        row.appendChild(teamNameCell);
        row.appendChild(membersCell);
        row.appendChild(editTd);
        row.appendChild(deleteTd);

        body.appendChild(row);
      } else{
        console.log("Error: In AppDB Null values are present");
      }
    });
}

fetchTeams();