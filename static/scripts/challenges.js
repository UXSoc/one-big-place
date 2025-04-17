const CHALLENGES = [
    {
        name: "Social Butterfly",
        increase: 1,
        description: "Share the event announcement post on Facebook."
    },
    {
        name: "Tweet Master",
        increase: 1,
        description: "Share the event link on X/Twitter."
    },
    {
        name: "#1 Fan",
        increase: 1,
        description: "Follow the User Experience Society Facebook Page."
    },
    {
        name: "Tara Gonz",
        increase: 1,
        description: "Place 120 total pixels during lunchtime (between 11:00am - 2:00pm)."
    },
    {
        name: "Excuse Me",
        increase: 1,
        description: "Replace 150 pixels placed by a user."
    },
    {
        name: "Starter Sketcher",
        increase: 1,
        description: "Place 200 pixels."
    },
    {
        name: "Master Painter",
        increase: 1,
        description: "Place 500 pixels."
    },
    {
        name: "Artistic Virtuouso",
        increase: 1,
        description: "Place 1000 pixels."
    },
    {
        name: "Grandmaster Artisan",
        increase: 1,
        description: "Place 5000 pixels."
    }
];

let challenges = document.querySelector(".challenges");
for (const challenge of CHALLENGES) {
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