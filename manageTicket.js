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
  teams.forEach(element => {
      if(element.content.hasOwnProperty('team'))
      {  
        const teams = element.content.team;
        const ticketName = element.content.ticketName;
        const ticketDetail = element.content.ticketDetail;
        // let sno = 1;
        const row = document.createElement("tr");
        // const slno = document.getElementById("td");
        const teamNameCell = document.createElement("td");
        const ticketNameCell = document.createElement("td");
        const ticketDetailCell = document.createElement("td");

        const editTd = document.createElement("td")
        const deleteTd = document.createElement("td");

        const editBtn = document.createElement("a");
        const deleteBtn = document.createElement("a");
        // slno.textContent = sno;
        teamNameCell.textContent = teams;
        ticketNameCell.textContent = ticketName;
        ticketDetailCell.textContent = ticketDetail;

        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editIcon.addEventListener("click",()=>{
          window.location.href = `createTicket.html?id=${element.id}`;
        })

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteIcon.addEventListener("click",()=>{
          domo.delete(`/domo/datastores/v1/collections/ticketingApp/documents/${element.id}`);
          alert("Team Deleted")
          location.reload();
        })

        editBtn.appendChild(editIcon);
        deleteBtn.appendChild(deleteIcon);
        
        editTd.appendChild(editBtn);
        deleteTd.appendChild(deleteBtn);
        // row.appendChild(slno);
        row.appendChild(teamNameCell);
        row.appendChild(ticketNameCell);
        row.appendChild(ticketDetailCell);

        row.appendChild(editTd);
        row.appendChild(deleteTd);

        body.appendChild(row);
      } else{
        console.log("Error: In AppDB Null values are present");
      }
    });
}

fetchTeams();