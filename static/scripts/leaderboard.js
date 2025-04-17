let leaderboard = null;
let userData = null;
let currentUserIdx = null;

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

    currentRank.textContent = `${currentUserIdx}`;
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
        let [leaderboardRes, userRes] = await Promise.all([
            fetch("json/statistics/leaderboard"),
            fetch("json/user"),
        ]);

        leaderboard = await leaderboardRes.json();
        userData = await userRes.json();

        if (!Array.isArray(leaderboard)) {
            leaderboard = [leaderboard];
        }

        let currentIdx = 1;
        for (const user of leaderboard) {
            if (user["id"] === userData["id"]) {
                currentUserIdx = currentIdx;
                break;
            }
            currentIdx++;
        }

        leaderboard = leaderboard.slice(0, 8);

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
}, 30000);