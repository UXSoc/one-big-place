import { openModal } from "./modals.js";
import { badge } from "./nav.js";
import { redeem } from "./redeem.js";
import { getUserData, updateUserData, userEventTarget } from "./user.js";

let challengeData;
async function fetchData() {
    try {
        let fetchRes = await fetch(`json/challenges?ts=${Date.now()}`).then((res) => res.json());
        challengeData = fetchRes;
        await loadChallenges(fetchRes);
    } catch (err) {
        console.error(err);
    }
}

fetchData();

async function loadChallenges(data) {
    badge('challenges', false);
    let challenges = document.querySelector(".challenges");
    const fragment = document.createDocumentFragment();
    const userData = await getUserData();
    if (!userData) {
        const message = document.createElement('p');
        message.innerHTML = "<span>Login</span> to complete challenges!";
        message.classList.add('login-message')
        message.querySelector('span').addEventListener('click', () => {
            openModal('login')
        })
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
        if (userData.bonus.includes(`challenge-${challenge["id"]}`)) {
            indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.innerText = `Claimed`;
            indicator.style.backgroundColor = '#b1b1b1';
        } else if (challenge["type"] == "link") {
            indicator = document.createElement('a');
            indicator.innerText = challenge["button"]||"";
            indicator.href = challenge["link"];
            indicator.target = "_blank";
            indicator.addEventListener('click', (e) => {
                claimLinkChallenge(challenge['id']);
                e.target.innerText = 'Waiting.'
                e.target.style.backgroundColor = '#b1b1b1';
            }, { once: true })
        } else if (challenge["type"] == "progress") {
            const total = challenge["required"];
            const current = userData[challenge["field"]];
            if (current>=total) {
                indicator = document.createElement('div');
                indicator.classList.add('indicator');
                indicator.classList.add('to-claim');
                indicator.innerText = `Claim!`;
                indicator.style.cursor = 'pointer';
                indicator.addEventListener('click', () => {
                    claimChallenge(challenge['id']);
                })
                badge('challenges', true);
            } else {
                indicator = document.createElement('a');
                indicator.className = "challenge-progress";
                indicator.innerText = `${userData[challenge["field"]]}/${challenge["required"]}`;
                const progress = document.createElement('div');
                const progressText = document.createElement('div');
                progressText.innerText = `${Math.min(current, total)}/${total}`;
                progress.style.width = `${Math.min(current/total*100,100)}%`;
    
                indicator.append(progress, progressText);
            }
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
    setTimeout(() => {
        if (challengeData) loadChallenges(challengeData);
    }, 0);
});

const linkTimeout = 25*1000;
async function claimLinkChallenge(challengeId) {
    setTimeout(() => {
        claimChallenge(challengeId)
    }, linkTimeout);
}
async function claimChallenge(chCode) {
    const userData = await getUserData();
    chCode = `challenge-${chCode}`
    redeem(chCode, false);
    updateUserData("bonus", [...(userData.bonus || []), chCode], userData.id)
}