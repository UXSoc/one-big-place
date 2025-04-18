import { getLeaderboardData, setLeaderboardData } from "./socket.js";
import { getUserData, setUserData, userEventTarget } from "./user.js";

function generateUserPlacement(userData) {
    let currentUser = document.querySelector(".ranks__currentUser")

    if (!userData) {
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

    if (userData?.place <= 10) return;

    let divLeft = document.createElement("div");
    let divMid = document.createElement("div");
    let divRight = document.createElement("div");

    let currentRank = document.createElement("p");
    let userName = document.createElement("p");
    let userPlaced = document.createElement("p");

    currentRank.textContent = `#${userData.place}`;
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

function generateLeaderboard(leaderboard, userData) {
    console.log(leaderboard)
    let ranks = document.querySelector(".ranks__users");
    const fragment = document.createDocumentFragment();
    for (let i = 1; i < leaderboard.length+1; i++) {
        const user = leaderboard[i-1]; 
        let div = document.createElement("div");
        let divLeft = document.createElement("div");
        let divMid = document.createElement("div");
        let divRight = document.createElement("div");

        let currentRank = document.createElement("p");
        let userName = document.createElement("p");
        let userPlaced = document.createElement("p");

        currentRank.textContent = `#${i}`;
        userName.textContent = `${(userData && userData.id == user.id)?"[You] ":""}${user["username"]}`;
        userPlaced.textContent = `${user["placeCount"]}`;

        if (userData && userData.id == user.id) { div.style.backgroundColor = '#f0e4ff' }

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
        fragment.appendChild(div);
    }
    ranks.replaceChildren(fragment);
}

var leaderboardUserIDs = [];
async function fetchData() {
    try {
        let fetchRes = await fetch("json/statistics/leaderboard").then((res) => res.json());

        setLeaderboardData(fetchRes);        

        const leaderboard = fetchRes;
        const userData = await getUserData();
        for (const user of leaderboard) {
            setUserData(user.id, user);
            leaderboardUserIDs.push(user.id);
        }

        generateLeaderboard(leaderboard, userData);
        generateUserPlacement(userData);
        setLeaderboardData(leaderboard)
    } catch (err) {
        console.error(err);
    }
}

fetchData();

async function updateLeaderboard() {
    const users = await Promise.all(
      leaderboardUserIDs.map(id => getUserData(id))
    );
    const sorted = users.sort((a, b) => b.placeCount - a.placeCount);
    return sorted;
}

userEventTarget.addEventListener('userUpdated', async (event) => {
    const { userId, field, value } = event.detail;
    generateLeaderboard(await updateLeaderboard(), await getUserData())
});
