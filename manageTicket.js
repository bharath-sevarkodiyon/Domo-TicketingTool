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

list.addEventListener("click", () => {
  document.getElementById("sliderData").classList.toggle("active")
})

showLoading()
// Create a loading screen and call the fetchTeams function inside it
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

  const teamsHead = document.createElement("th");
  const ticketNameHead = document.createElement("th");
  const ticketDetailHead = document.createElement("th");

  teamsHead.textContent = "Team Name";
  ticketNameHead.textContent = "Ticket Name";
  ticketDetailHead.textContent = "Ticket Details";

  headTr.appendChild(teamsHead)
  headTr.appendChild(ticketNameHead)
  headTr.appendChild(ticketDetailHead)

  head.appendChild(headTr)
  const body = document.querySelector("#teamList #body");
  console.log(teams);
  teams.forEach(element => {
      if(element.content.hasOwnProperty('team'))      // validating the teamName from AppDB
      {  
        const teams = element.content.team;
        const ticketName = element.content.ticketName;
        const ticketDetail = element.content.ticketDetail;

        const row = document.createElement("tr");

        // Creating a table data to store the value
        const teamNameCell = document.createElement("td");
        const ticketNameCell = document.createElement("td");
        const ticketDetailCell = document.createElement("td");
        const editTd = document.createElement("td")
        const deleteTd = document.createElement("td");

        // Creating Edit and Delete button
        const editBtn = document.createElement("a");
        const deleteBtn = document.createElement("a");

        // Assigning the values
        teamNameCell.textContent = teams;
        ticketNameCell.textContent = ticketName;
        ticketDetailCell.textContent = ticketDetail;

        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editIcon.addEventListener("click",()=>{
          // It will navigate to the create team page with existing value
          window.location.href = `createTicket.html?id=${element.id}`;
        })

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteIcon.addEventListener("click",()=>{
        // Getting conformation before deleting the data
        const conDiv = document.querySelector(".conDiv");
        conDiv.style.display = "block";

        const yes = document.getElementById("yes")
        const no = document.getElementById("no")

        const handleYes = ()=>{
          showLoad()
          domo.delete(`/domo/datastores/v1/collections/ticketingApp/documents/${element.id}`)
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