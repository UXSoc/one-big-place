import { getLeaderboardData, setLeaderboardData } from "./socket";

let leaderboard = null;
let userData = null;
let currentUserIdx = null;
let isCurrentUserInTop = false;

function generateUserPlacement() {
    let currentUser = document.querySelector(".ranks__currentUser")

    if ("error" in userData) {
        let div = document.createElement("div");
        let p = document.createElement("p");
        p.textContent = "Login to see your placement!";
        div.appendChild(p);
        div.style = `
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
        `;
        currentUser.appendChild(div);
        return;
    }

    let divLeft = document.createElement("div");
    let divMid = document.createElement("div");
    let divRight = document.createElement("div");

    let currentRank = document.createElement("p");
    let userName = document.createElement("p");
    let userPlaced = document.createElement("p");

    currentRank.textContent = (isCurrentUserInTop ? `${currentUserIdx}` : `10+`);
    userName.textContent = `[You] ${userData["username"]}`;
    userPlaced.textContent = `${userData["placeCount"]}`;

    divLeft.appendChild(currentRank);
    divLeft.setAttribute("class", "divLeft");
    divMid.appendChild(userName);
    divMid.setAttribute("class", "divMid");
    divRight.appendChild(userPlaced);
    divRight.setAttribute("class", "divRight");

    currentUser.appendChild(divLeft);
    currentUser.appendChild(divMid);
    currentUser.appendChild(divRight);
    currentUser.style.outline = `1.5px solid black`;
}

function generateLeaderboard() {
    let ranks = document.querySelector(".ranks__users");
    let idx = 1;
    for (const user of leaderboard) {
        let div = document.createElement("div");
        let divLeft = document.createElement("div");
        let divMid = document.createElement("div");
        let divRight = document.createElement("div");

        let currentRank = document.createElement("p");
        let userName = document.createElement("p");
        let userPlaced = document.createElement("p");

        currentRank.textContent = `${idx}`;
        userName.textContent = `${user["username"]}`;
        userPlaced.textContent = `${user["placeCount"]}`;

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
}

async function fetchData() {
    try {
        let fetchRes = await fetch("json/statistics/leaderboard").then((res) => res.json());

        setLeaderboardData(fetchRes);        

        leaderboard = fetchRes["leaderboard"];
        userData = fetchRes["user"];

        leaderboard = (Array.isArray(leaderboard) ? leaderboard : [leaderboard]); 

        let currentIdx = 1;
        for (const user of leaderboard) {
            if (user["id"] === userData["id"]) {
                isCurrentUserInTop = true;
                currentUserIdx = currentIdx;
                break;
            }
            currentIdx++;
        }

        generateLeaderboard();
        generateUserPlacement();
    } catch (err) {
        console.error(err);
    }
}

fetchData();
setInterval(() => {
    document.querySelector(".ranks__users").textContent = "";
    document.querySelector(".ranks__currentUser").textContent = "";
    fetchData(); 
}, 1000);