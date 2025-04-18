import { getUserData, userEventTarget } from "./user.js";

let challengeData;
async function fetchData() {
    try {
        let fetchRes = await fetch("json/challenges").then((res) => res.json());
        challengeData = fetchRes;
        await loadChallenges(fetchRes);
    } catch (err) {
        console.error(err);
    }
}

fetchData();

async function loadChallenges(data) {
    let challenges = document.querySelector(".challenges");
    const fragment = document.createDocumentFragment();
    const userData = await getUserData();
    if (!userData) {
        const message = document.createElement('p');
        message.innerText = "Login to complete challenges!";
        challenges.parentElement.append(message);
        return;
    }
    for (const challenge of data) {
        let div = document.createElement("div");
        let divFirst = document.createElement("div");
        let divSecond = document.createElement("div");
    
        let challengeName = document.createElement("p");
        let challengeIncrease = document.createElement("div");
        let challengeDescription = document.createElement("p");
    
        challengeName.textContent = `${challenge["name"]}`;
        challengeIncrease.textContent = `+1`;
        challengeDescription.textContent = `${challenge["description"]}`;

        let indicator;
        if (challenge["type"] == "link") {
            indicator = document.createElement('a');
            indicator.innerText = challenge["button"]||"";
            indicator.href = challenge["link"];
            indicator.target = "_blank";
        } else if (challenge["type"] == "progress") {
            indicator = document.createElement('a');
            indicator.className = "challenge-progress";
            indicator.innerText = `${userData[challenge["field"]]}/${challenge["required"]}`;
            const progress = document.createElement('div');
            const progressText = document.createElement('div');
            const total = challenge["required"];
            const current = userData[challenge["field"]];
            if (current>=total) {
                progressText.innerText = `Complete`;
                progressText.style.backgroundColor = `#711ede`;
                indicator.style.outline = `2px solid #711ede`;
                progressText.style.outline = `2px solid #711ede`;
                progress.style.width = `100%`;
            } else {
                progressText.innerText = `${Math.min(current, total)}/${total}`;
                progress.style.width = `${Math.min(current/total*100,100)}%`;
            }

            indicator.append(progress, progressText);
        }
    
        divFirst.appendChild(challengeName);
        divFirst.appendChild(challengeIncrease);
        divFirst.setAttribute("class", "divFirst");
        divSecond.appendChild(challengeDescription);
        divSecond.setAttribute("class", "divSecond");
    
        div.setAttribute("class", "challenge");
        div.appendChild(divFirst);
        div.appendChild(divSecond);
        div.appendChild(indicator)
        fragment.appendChild(div);
    }
    challenges.replaceChildren(fragment);
}

userEventTarget.addEventListener('userUpdated', async (event) => {
    const { userId, field, value } = event.detail;
    if (challengeData) loadChallenges(challengeData);
});
