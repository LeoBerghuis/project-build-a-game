let player = [];
const buttonHtml = `<button class="add-player-btn">Add new player</button>`
const addPlayerHtml = ` <div class="add-team">
            <p>Add team</p>
            <input type="text" class="team-input" placeholder="Add team name">
            <div class="username">
                <p>Add username</p>
                <input type="text" class="username-input" placeholder="Ex: Leoberg123">
            </div>
            <div class="bio">
                <p>Add bio</p>
                <input type="text" class="bio-input" placeholder="Ex: Hello world!">
          
            </div>
                  <button class="make-player-btn">Make player</button>
        </div>`;




if (JSON.parse(localStorage.getItem("playerObj"))) {
    const storedPlayers = JSON.parse(localStorage.getItem("playerObj"));
    player.push(makePlayer("yellow", "PLACEHOLDER", 0, 0, "This is a placeholder bio."));
    player.push(makePlayer("red", "PLACEHOLDER", 0, 0, "This is another placeholder bio."));
    player = storedPlayers
    showAllPlayers();

} else {
    player.push(makePlayer("yellow", "PLACEHOLDER", 0, 0, "This is a placeholder bio."));
    player.push(makePlayer("red", "PLACEHOLDER", 0, 0, "This is another placeholder bio."));
    localStorage.setItem("playerObj", JSON.stringify(player));
}



function makePlayer(team, username, level, xp, bio) {
    const player = {
        team: team,
        username: username,
        level: level,
        xp: xp,
        bio: bio
    };

    return player;
}

function showAllPlayers() {
    let newInnerHTML = "";
    for (let i = 0; i < player.length; i++) {
        const players = player[i];
        newInnerHTML += `
    <div class="team">
        ${players.team}
        <p class="username">${players.username}</p>
        <p class="bio">${players.bio}</p>
        <div class="level">
        ${'Level: ' + players.level + ' | ' + players.xp + ' xp'}
        </div>
    </div>
`;
    }
    settingsWindow.innerHTML = newInnerHTML + buttonHtml + addPlayerHtml;

    const playerBtn = document.querySelector('.add-player-btn');
    playerBtn.addEventListener('click', showPlayerActive);

    const playerAddBtn = document.querySelector('.make-player-btn');
    playerAddBtn.addEventListener('click', addPlayer);
}



function showPlayerActive() {
    console.log('teast')
    const playerActive = document.querySelector('.add-team');
    playerActive.classList.toggle('active');
}

function addPlayer() {
    const inputValueTeam = document.querySelector('.team-input').value;
    const inputValueUsername = document.querySelector('.username-input').value;
    const inputValueBio = document.querySelector('.bio-input').value;


    if (!inputValueTeam || !inputValueUsername || !inputValueBio) {
        alert('Please fill out all fields!');
        return;
    }

    const newPlayer = makePlayer(inputValueTeam, inputValueUsername, 0, 0, inputValueBio);
    player.push(newPlayer);
    localStorage.setItem("playerObj", JSON.stringify(player));
    showAllPlayers();
    clearInputs();
}

function clearInputs() {
    document.querySelector('.team-input').value = '';
    document.querySelector('.username-input').value = '';
    document.querySelector('.bio-input').value = '';
}