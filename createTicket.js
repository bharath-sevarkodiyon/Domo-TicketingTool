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
// Team name dropdown
const displayTeamNames = (response) => {
    for (let iterator of response) {
        teamNameList.push(iterator.content.teamName);
    }
    let td = document.getElementById("showTeam");
    let ul = document.createElement("ul");
    ul.className = "team-list";
    ul.style.listStyle = "none";
    teamNameList.forEach((name) => {
        let li = document.createElement("li");
        li.textContent = name;
        // console.log(li.textContent);
        ul.appendChild(li);
        li.addEventListener("click", () => {
            selectedTeamName = li.textContent;
            li.classList.toggle("active")
        })
    })
    td.appendChild(ul);
}

// After loading HTML this below line will gets loaded
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search); // it will URL along with the endpoint(AppDB id)
    const teamId = urlParams.get('id'); // getting only the endpoint(AppDB Id)
    console.log("teamID", teamId);
    let ticketname = document.getElementById("ticketName");
    let ticketdetail = document.getElementById("detail");
    if (teamId) {
        // Fetch the existing team data using the teamId
        domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/${teamId}`)
            .then(response => {
                const teamData = response.content;
                console.log(teamData);
                selectedTeamName = teamData.team;
                ticketname.value = teamData.ticketName;
                ticketdetail.value = teamData.ticketDetail;
            })
    }
    // triggering the event while clicking the create button
    document.getElementById("submit").addEventListener("click", async () => {
        let wholeTeam = selectedTeamName;
        let emailSub = ticketname.value;
        let emailBody = ticketdetail.value
        // try {
            const data = await domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/`);
            let teamNameArray;
            for (const iterator of data) {
                if (iterator.content.teamName === wholeTeam) {
                    teamNameArray = iterator.content.selectedNames;
                    const users = await domo.get(`/domo/users/v1?includeDetails=true&limit=150`);
                    let id = []; // temp variable
                    for (let user of users) {
                        for (const name of teamNameArray) {
                            if (name === user.displayName) {
                                id.push(user.id);
                            }
                        }
                    }
                    const startWorkflow = (alias, body) => {
                        return domo.post(`/domo/workflow/v1/models/${alias}/start`, body);  // mail sending api
                    };
                    await Promise.all(
                        id.map((personId) => {
                            startWorkflow("sendEmail", { to: personId, subject: emailSub, body: emailBody });
                        })
                    )
                    console.log(id);
                    break;
                } else {
                    console.log("not found");
                }
            }
            const createTicket = {
                content: {
                    team: selectedTeamName,
                    ticketName: ticketname.value,
                    ticketDetail: ticketdetail.value
                }
            };
            console.log("teamID inside create button", teamId);
            if (!teamId) {
                // If the record is not present using post method, creating the record
                await domo.post(`/domo/datastores/v1/collections/ticketingApp/documents/`, createTicket);
                console.log("Pushed to AppDB");
                selectedTeamName = '';
                ticketname.value = '';
                ticketdetail.value = '';
                window.location.href = "manageTicket.html";
            } else {
                const updateTicket = {
                    content: {
                        team: selectedTeamName,
                        ticketName: ticketname.value,
                        ticketDetail: ticketdetail.value
                    }
                };
                await domo.put(`/domo/datastores/v1/collections/ticketingApp/documents/${teamId}`, updateTicket);
                console.log("Updated the changes");
                window.location.href = "manageTicket.html";
            }
        // } catch (error) {
        //     console.error("Error:", error);
        // }
    });
});

