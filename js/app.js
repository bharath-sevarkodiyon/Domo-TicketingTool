const userLoginLogo = document.getElementById("userLoginLogo");  // it is div tag
const list = document.getElementById("list");   // it is fa-List icon
const fullName = document.getElementById("fullName"); // it is a h4 tag tried to store the user full name
let teamName = document.getElementById("teamNameInp");

domo.get(`/domo/users/v1/${domo.env.userId}?includeDetails=true`)
    .then((response) => {
        let firstLetter = response.displayName.slice(0, 1);
        let currentUserName = response.displayName;
        assigningValue(currentUserName, firstLetter)
    });

function assigningValue(name, letter) {
    let p = document.createElement("p");
    p.innerHTML = "Welcome" + " " + `<b>${letter}</b>`;
    userLoginLogo.appendChild(p);
    fullName.innerHTML = name;
}

list.addEventListener("click", () => {
    document.getElementById("sliderData").classList.toggle("active");
});

let namesArray = [];
let selectedNames = [];
let teamData = null;

domo.get(`/domo/users/v1?includeDetails=true&limit=150`).then((response) => {
    response.forEach((element) => {
        namesArray.push(element.displayName);
    });
    populateItemList();
});

function addSelectedItem(name) {
    if (selectedNames.includes(name)) {
        alert(`${name} is already selected.`);
        return;
    }
    selectedNames.push(name);
    displaySelectedNames();
}

function displaySelectedNames() {
    const peopleNameScroll = document.getElementById('peopleNameScroll');
    peopleNameScroll.innerHTML = ''; // Clear current displayed items
    selectedNames.forEach(name => {
        const selectedItem = document.createElement('span');
        selectedItem.className = 'selected-item';
        selectedItem.textContent = name;
        const removeButton = document.createElement('button');
        removeButton.textContent = '×';
        removeButton.addEventListener('click', () => {
            // deleting the name from the selectedNames array
            selectedNames = selectedNames.filter(selectedName => selectedName !== name);
            displaySelectedNames(); // after deleting, update the changes.
        });
        selectedItem.appendChild(removeButton);
        peopleNameScroll.appendChild(selectedItem);
    });
}

function populateItemList() {
    const itemList = document.querySelector('.item-list');
    itemList.innerHTML = '';
    namesArray.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.setAttribute('data-value', name);
        li.style.cursor = 'pointer';
        li.addEventListener('click', function () {
            addSelectedItem(name);
        });
        itemList.appendChild(li);
    });
}

const validateTeamName = (teamNames) => {
    console.log("function called", teamNames);
    for (let element of teamNames) {
        if (element.content.teamName === teamName.value) {
            alert(`Team name is already present`);
            teamName.value = '';
            return false;
        }
    }
    return true;
}

// After loading HTML this below line will gets loaded
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search); // it will URL along with the endpoint(AppDB id)
    const teamId = urlParams.get('id'); // getting only the endpoint(AppDB Id)
    console.log("teamID", teamId);

    if (teamId) {
        // Fetch the existing team data using the teamId
        domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/${teamId}`)
            .then(response => {
                teamData = response.content;
                document.getElementById('teamNameInp').value = teamData.teamName;
                selectedNames = teamData.selectedNames; // Set selectedNames to existing data
                console.log("got the data", selectedNames);
                displaySelectedNames();
            });
    }

    // triggering the event while clicking the create button
    document.getElementById("create").addEventListener("click", () => {
        const teamNameValue = document.getElementById("teamNameInp").value;
        const createdTeam = {
            content: {
                teamName: teamNameValue,
                selectedNames: selectedNames
            }
        };

        // validation for duplicate teamName
        if (!teamId) {
            domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/`)
                .then(data => {
                    console.log("Data getting inside to validate duplicate teamName", data);
                    if (validateTeamName(data)) {
                        console.log("Team name is valid");
                        // If the record is not present using post method, creating the record
                        domo.post(`/domo/datastores/v1/collections/ticketingApp/documents/`, createdTeam)
                            .then(data => console.log("Created new data", data));
                        selectedNames = [];
                        document.getElementById('peopleNameScroll').innerHTML = '';
                        window.location.href = "manageTeam.html";
                    } else {
                        console.log("Team name is invalid");
                    }
                });
        } else {
            // Edit functionality
            const updatedTeam = {
                content: {
                    teamName: teamNameValue,
                    selectedNames: selectedNames // use the current state of selectedNames directly
                }
            };
            const update = async () => {
                await domo.put(`/domo/datastores/v1/collections/ticketingApp/documents/${teamId}`, updatedTeam)
                    .then(data => console.log(data));
                window.location.href = "manageTeam.html";
            }
            update();
        }
    });
});
