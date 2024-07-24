const userLoginLogo = document.getElementById("userLoginLogo");  // it is div tag
const list = document.getElementById("list");   // it is fa-List icon
const fullName = document.getElementById("fullName"); // it is a h4 tag tried to store the user full name
let teamName = document.getElementById("teamNameInp");
domo.get(`/domo/users/v1/${domo.env.userId}?includeDetails=true`)
    .then((response) => {
        let firstLetter = response.displayName.slice(0, 1);
        let currentUserName = response.displayName;
        assigningValue(currentUserName, firstLetter)
    })
function assigningValue(name, letter) {
    let p = document.createElement("p")
    p.innerHTML = "Welcome" + " " + `<b>${letter}</b>`;
    userLoginLogo.appendChild(p);
    fullName.innerHTML = name;
}
list.addEventListener("click", () => {
    document.getElementById("sliderData").classList.toggle("active")
})

let namesArray = [];
let selectedNames = [];
domo.get(`/domo/users/v1?includeDetails=true&limit=150`).then((response) => {
    // console.log(response);
    response.forEach((element) => {
        namesArray.push(element.displayName)
    })
    populateItemList();
})
function addSelectedItem(name) {
    if (selectedNames.includes(name)) {
        alert(`${name} is already selected.`);
        return;
    }
    selectedNames.push(name);
    displaySelectedNames();

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



const validateTeamName = (teamNames)=>{
    console.log("function called",teamNames);
    for (let element of teamNames) {
        if (element.content.teamName === teamName.value) {
            alert(`Team name is already present`);
            teamName.value = '';
            return false;
        }
    }
    return true;
}

document.getElementById("create").addEventListener("click", ()=>{
    // To get the data from the AppDB to validate the team name
    domo.get(`/domo/datastores/v1/collections/ticketingApp/documents/`)
    .then(data => {
    if (validateTeamName(data)) {
        console.log("Team name is valid");
        window.location.href = "manageTeam.html";
    } else {
        console.log("Team name is invalid");
    }
    })
    console.log("Team Name", teamName.value);
    console.log(selectedNames);
    const createdTeam = {
        content: {
            teamName: teamName.value,
            selectedNames: selectedNames
        }
    };
    // To post the data into the collection
    domo.post(`/domo/datastores/v1/collections/ticketingApp/documents/`, createdTeam)
    .then(data => console.log(data))
    selectedNames = [];
    document.getElementById('peopleNameScroll').innerHTML = '';
})
