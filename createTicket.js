const list = document.getElementById("list");
list.addEventListener("click", () => {
    document.getElementById("sliderData").classList.toggle("active")
})

domo.get(`/domo/datastores/v1/collections/ticketingApp/documents`)
    .then(response => {
    // console.log(response);
    displayTeamNames(response);
})
let teamNameList = [];
let selectedTeamName;
const displayTeamNames = (response)=>{
    for(let iterator of response){
    teamNameList.push(iterator.content.teamName);
    }
    let td = document.getElementById("showTeam");
    let ul = document.createElement("ul");
    ul.className = "team-list";
    ul.style.listStyle = "none";
    teamNameList.forEach((name)=>{
        let li = document.createElement("li");
        li.textContent = name;
        console.log(li.textContent);
        ul.appendChild(li);
        li.addEventListener("click", ()=>{
            selectedTeamName = li.textContent;
        })
    })
    td.appendChild(ul);
}
document.getElementById("submit").addEventListener("click", ()=>{
    let ticketName = document.getElementById("ticketName");
    let ticketDetail = document.getElementById("detail");
    console.log(selectedTeamName);
    console.log(ticketName.value);
    console.log(ticketDetail.value);
    const createTicket = {
        content: {
            team: selectedTeamName,
            ticketName: ticketName.value,
            ticketDetail: ticketDetail.value
        }
    }
    domo.post(`/domo/datastores/v1/collections/ticketingApp/documents/`, createTicket)
    .then(data => console.log(data))
    selectedTeamName = '';
    ticketName.value = '';
    ticketDetail.value = '';
})