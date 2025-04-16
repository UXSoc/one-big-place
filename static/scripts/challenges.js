const DUMMY_CHALLENGES = [
    {
        name: "Social Butterfly",
        increase: "1",
        description: "Share the event announcement post on Facebook."
    }
];

let challenges = document.querySelector(".challenges");
for (const challenge of DUMMY_CHALLENGES) {
    let div = document.createElement("div");
    let divFirst = document.createElement("div");
    let divSecond = document.createElement("div");

    let challengeName = document.createElement("p");
    let challengeIncrease = document.createElement("div");
    let challengeDescription = document.createElement("p");

    challengeName.textContent = `${challenge["name"]}`;
    challengeIncrease.textContent = `+${challenge["increase"]}`;
    challengeDescription.textContent = `${challenge["description"]}`;

    divFirst.appendChild(challengeName);
    divFirst.appendChild(challengeIncrease);
    divFirst.setAttribute("class", "divFirst");
    divSecond.appendChild(challengeDescription);
    divSecond.setAttribute("class", "divSecond");

    div.setAttribute("class", "challenge");
    div.appendChild(divFirst);
    div.appendChild(divSecond);
    challenges.appendChild(div);
}