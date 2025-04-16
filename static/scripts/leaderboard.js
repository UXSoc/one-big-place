const DUMMY_USERS = [
    {
        name: "User1",
        placed: "10000"
    },
    {
        name: "User2",
        placed: "9000"
    }
];

let ranks = document.querySelector(".ranks__users");
let idx = 1;
for (const user of DUMMY_USERS) {
    let div = document.createElement("div");
    let divLeft = document.createElement("div");
    let divMid = document.createElement("div");
    let divRight = document.createElement("div");

    let currentRank = document.createElement("p");
    let userName = document.createElement("p");
    let userPlaced = document.createElement("p");

    currentRank.textContent = `${idx}`;
    userName.textContent = `${user["name"]}`;
    userPlaced.textContent = `${user["placed"]}`;

    divLeft.appendChild(currentRank)
    divLeft.setAttribute("class", "divLeft");
    divMid.appendChild(userName);
    divMid.setAttribute("class", "divMid");
    divRight.appendChild(userPlaced);
    divRight.setAttribute("class", "divRight");
    div.appendChild(divLeft);
    div.appendChild(divMid);
    div.appendChild(divRight);
    div.setAttribute("class", "ranks__user");
    ranks.appendChild(div);

    idx++;
}

let currentUser = document.querySelector(".ranks__currentUser")
let currentUserIdx = 0;

let divLeft = document.createElement("div");
let divMid = document.createElement("div");
let divRight = document.createElement("div");

let currentRank = document.createElement("p");
let userName = document.createElement("p");
let userPlaced = document.createElement("p");

currentRank.textContent = `${currentUserIdx+1}`;
userName.textContent = `[You] ${DUMMY_USERS[currentUserIdx]["name"]}`;
userPlaced.textContent = `${DUMMY_USERS[currentUserIdx]["placed"]}`;

divLeft.appendChild(currentRank);
divLeft.setAttribute("class", "divLeft");
divMid.appendChild(userName);
divMid.setAttribute("class", "divMid");
divRight.appendChild(userPlaced);
divRight.setAttribute("class", "divRight");

currentUser.appendChild(divLeft);
currentUser.appendChild(divMid);
currentUser.appendChild(divRight);