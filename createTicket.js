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
domo.get(`/domo/datastores/v1/collections/ticketingApp/documents`)
    .then(response => {
        displayTeamNames(response);
        hideLoading()
    })
let teamNameList = [];
let selectedTeamName = null;
let selectedLi = null;

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
        ul.appendChild(li);
        li.addEventListener("click", () => {
            // If a list item is already selected, remove its background
            if (selectedLi && selectedLi !== li) {
                selectedLi.style.background = "transparent";
            }

            // Toggle selection
            if (selectedLi === li) {
                li.style.background = "transparent";
                selectedLi = null;
                selectedTeamName = null;
            } else {
                li.style.background = "#81838B";
                selectedLi = li;
                selectedTeamName = li.textContent;
            }
        });
        // While editing selected item will shown
        if (name === selectedTeamName) {
            li.style.background = "#81838B";
            selectedLi = li;
        }
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
        document.getElementById("title").innerHTML = "Update Ticket"
        // Fetch the existing team data using the teamId
        domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/${teamId}`)
            .then(response => {
                const teamData = response.content;
                console.log(teamData);
                selectedTeamName = teamData.team;
                ticketname.value = teamData.ticketName;
                ticketdetail.value = teamData.ticketDetail;
                highlightSelectedTeam();
            })
    }

    // Error message will popup
    const EmptyFieldError = () => {
        let count = 0;
        const interval = setInterval(() => {
            if (count < 5) {
                const emptyField = document.getElementById("emptyField");
                emptyField.style.display = "block";
                emptyField.style.color = "red";
                emptyField.style.transition = "all 1s ease-in";
                count++;
            } else {
                clearInterval(interval);
            }
            console.log(count);
        }, 1000);
        // After some time the error message will go off
        setTimeout(() => {
            console.log("timeout");
            let emptyField = document.getElementById("emptyField");
            emptyField.style.display = "none";
            emptyField.style.transition = "all 1s ease-out";
        }, 6000);

        // Resetting the data
        const teamListItems = document.querySelectorAll('.team-list li');
        teamListItems.forEach(li => {
            li.style.background = "transparent";
            selectedLi = li;
        });
        selectedTeamName = '';
        ticketname.value = '';
        ticketdetail.value = '';
    }

    // Check any empty fields are present
    const validateFields = () => {
        if (selectedTeamName === '' || ticketname.value === '' || ticketdetail.value === '') {
            EmptyFieldError();
            return false;
        }
        return true;
    }

    // To get the selected li, while editing ticket
    const highlightSelectedTeam = () => {
        const teamListItems = document.querySelectorAll('.team-list li');
        teamListItems.forEach(li => {
            if (li.textContent === selectedTeamName) {
                li.style.background = "#81838B";
                selectedLi = li;
            } else {
                li.style.background = "transparent";
            }
        });
    }
    
    // triggering the event while clicking the create button
    document.getElementById("submit").addEventListener("click", async () => {
        let wholeTeam = selectedTeamName;
        let emailSub = ticketname.value;
        let emailBody = ticketdetail.value
        if (!validateFields()) {
            wholeTeam = '';
            emailSub = '';
            emailBody = '';
            return;
        }
        showLoad()
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
            hideLoad()
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
    });
});