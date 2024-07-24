const userLoginLogo = document.getElementById("userLoginLogo");
const list = document.getElementById("list");
const fullName = document.getElementById("fullName");
const createTeam = document.getElementById("createTeam");
const namesArray = [];
domo.get(`/domo/users/v1/${domo.env.userId}?includeDetails=true`)
.then((response)=>{
    namesArray.push(response.displayName);
    let p = document.createElement("p")
    p.innerHTML = "Welcome" + " " + `<b>${response.displayName.slice(0,1)}</b>`;
    userLoginLogo.appendChild(p);
    fullName.innerHTML = response.displayName;
})

list.addEventListener("click", ()=>{
    document.getElementById("sliderData").classList.toggle("active")
})

createTeam.addEventListener("click", ()=>{
    document.getElementById("teamNameAndPeople").classList.toggle("active");
    document.getElementById("create").classList.toggle("active");
})

// function addSelectedItem(name) {
//       const selectedItem = document.createElement('span');  // creating span tag
//       selectedItem.className = 'selected-item';  // assigning class name for span tag
//       selectedItem.textContent = name;   // adding the data into span tag, present inside div
//       const peopleNameScroll = document.getElementById('peopleNameScroll');
//       peopleNameScroll.appendChild(selectedItem); // adding span to div tag
//     }

// function populateItemList() {
//     const itemList = document.querySelector('.item-list');

//     namesArray.forEach(name => {
//         const li = document.createElement('li');
//         li.textContent = name;
//         li.setAttribute('data-value', name);       
//         li.addEventListener('click', function() {
//             addSelectedItem(name);
//         });
//         itemList.appendChild(li);
//     });
// }
// populateItemList();

