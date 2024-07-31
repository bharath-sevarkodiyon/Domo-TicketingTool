// Home Page Ends

const userLoginLogo = document.getElementById("userLoginLogo");  // it is div tag
const list = document.getElementById("list");   // it is fa-List icon
const fullName = document.getElementById("fullName"); // it is a h4 tag tried to store the user full name
let teamName = document.getElementById("teamNameInp");

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

showLoading()
domo.get(`/domo/users/v1/${domo.env.userId}?includeDetails=true`)
    .then((response) => {
        let firstLetter = response.displayName.slice(0, 1);
        let currentUserName = response.displayName;
        assigningValue(currentUserName, firstLetter)
        hideLoading();
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

// Home Page Ends

// Create Team Page
let namesArray = [];
let selectedNames = [];
let teamData = null;

showLoading();

domo.get(`/domo/users/v1?includeDetails=true&limit=150`).then((response) => {
    response.forEach((element) => {
        namesArray.push(element.displayName);
    });
    populateItemList();
    hideLoading();
});

// To avoid selecting the duplicate people
function addSelectedItem(name) {
    if (selectedNames.includes(name)) {
        alert(`${name} is already selected.`);
        return;
    }
    selectedNames.push(name);
    displaySelectedNames();
}

// To display the selected people names in the team
function displaySelectedNames() {
    const peopleNameScroll = document.getElementById('peopleNameScroll');
    peopleNameScroll.addEventListener("click", ()=>{
        document.querySelector("searchField").classList.toggle("active")
    })
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

// To display all the names while choosing people 
function populateItemList(filter = '') {
    const itemList = document.querySelector('.item-list');
    itemList.innerHTML = '';
    namesArray
    .filter(name => name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        li.setAttribute('data-value', name);
        li.style.cursor = 'pointer';
        li.addEventListener('click', function () {
            addSelectedItem(name);
            document.querySelector('.searchField').value=''
            populateItemList()
        });
        itemList.appendChild(li);
    });
}
// Search field while creating a team
const searchField = document.querySelector(".searchField")
    searchField.addEventListener('input', (event) => {
        console.log(event.target.value);
        populateItemList(event.target.value);
    });

// Validate the duplicate team name while creating
const validateTeamName = (teamNames) => {
    console.log("function called", teamNames);
    for (let element of teamNames) {
        if (element.content.teamName === teamName.value) {
            // Error message will popup
            let count = 0;
            setInterval(() => {
            if(count<5){
                let resp = document.getElementById("error")
                resp.style.display = "block";
                resp.style.color = "red"
                resp.style.transition = "all 1s ease-in";
                count++
            } console.log(count);
            }, 1000);
            // After some time the error message will go off
            setTimeout(()=>{
                console.log("timeout");
                let resp =  document.getElementById("error");
                resp.style.display = "none";
                resp.style.transition = "all 1s ease-out"
            },6000);
            // Resetting the data
            teamName.value = '';
            selectedNames = [];
            document.getElementById('peopleNameScroll').innerHTML = '';
            return false;
        }
    }
    return true;
}

const EmptyFieldError = () => {
    // Error message will popup
    let count = 0;
    const interval = setInterval(() => {
        if(count < 5) {
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
    document.getElementById("teamNameInp").value = '';
    selectedNames = [];
    document.getElementById('peopleNameScroll').innerHTML = '';
}

// Check any empty fields are present
const validateFields = () => {
    const teamNameValue = document.getElementById("teamNameInp").value;
    if(teamNameValue === '' || selectedNames.length === 0) {
        EmptyFieldError();
        hideLoad()
        return false;
    }
    return true;
}

// After loading HTML this below line will gets loaded
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search); // it will URL along with the endpoint(AppDB id)
    const teamId = urlParams.get('id'); // getting only the endpoint(AppDB Id)
    console.log("teamID", teamId);
    if (teamId) {
        document.getElementById("title").innerHTML = "Update Team"
        document.getElementById("create").innerHTML = "Update"
        // Fetch the existing team data using the teamId
        domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/${teamId}`)
            .then(response => {
                teamData = response.content;
                // Assigning selectedNames and teamName to existing data
                document.getElementById('teamNameInp').value = teamData.teamName;
                selectedNames = teamData.selectedNames; 
                console.log("got the data", selectedNames);
                displaySelectedNames();
            });
    }

    // triggering the event while clicking the create button
    document.getElementById("create").addEventListener("click", () => {
        showLoad()
        const teamNameValue = document.getElementById("teamNameInp").value;
        if (!validateFields()) {
            teamNameValue = '';
            selectedNames=[]
            return;
        }

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
                        hideLoad()
                        domo.post(`/domo/datastores/v1/collections/ticketingApp/documents/`, createdTeam)
                            .then(data => {
                                console.log("Created new data", data)
                                selectedNames = [];
                                document.getElementById('peopleNameScroll').innerHTML = '';
                                window.location.href = "manageTeam.html";
                                hideLoad()
                            });
                    } else {
                        hideLoad()
                        console.log("Team name is invalid");
                        // Resetting the data
                        teamNameValue = '';
                        selectedNames = [];
                        document.getElementById('peopleNameScroll').innerHTML = '';
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