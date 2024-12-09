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

checkLocalStorage()

function checkLocalStorage() {
    const storedPlayers = JSON.parse(localStorage.getItem("playerObj"));
    if (storedPlayers) {
        player = storedPlayers;
    } else {
        player.push(makePlayer("yellow", "Yellow team", 0, 0, "This is a placeholder bio."));
        player.push(makePlayer("red", "Red team", 0, 0, "This is another placeholder bio."));
        localStorage.setItem("playerObj", JSON.stringify(player));
    }
    showAllPlayers();
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
<div class="team" data-index="${i}">
    <span class="team-name">${players.team}</span>
    <p class="username">${players.username}</p>
    <p class="bio">${players.bio}</p>
    <div class="level">
        ${'Level: ' + players.level + ' | ' + players.xp + ' xp'}
    </div>
    <button class="edit-btn" data-index="${i}">Edit</button>
    <div class="edit-section" data-index="${i}" style="display: none;">
        <p class="username-edit">Edit username</p>
        <input type="text" class="edit-username" value="${players.username}">
        <p class="bio-edit">Edit bio</p>
        <input type="text" class="edit-bio" value="${players.bio}">
        <p class="team-edit">Edit team</p>
        <input type="text" class="edit-team" value="${players.team}">
        <button class="save-btn" data-index="${i}">Save</button>
        <button class="cancel-btn" data-index="${i}">Cancel</button>
    </div>
</div>`;
    }

    settingsWindow.innerHTML = newInnerHTML + buttonHtml + addPlayerHtml;


    const editButtons = document.querySelector('.edit-btn');
    for (let i = 0; i < editButtons.length; i++) {
        const index = i;
        editButtons[i].addEventListener('click', function () {
            toggleEditSection(index);
        });
    }

    const saveButtons = document.querySelector('.save-btn');
    for (let i = 0; i < saveButtons.length; i++) {
        const index = i;
        saveButtons[i].addEventListener('click', function () {
            savePlayerEdits(index);
        });
    }

    const cancelButtons = document.querySelector('.cancel-btn');
    for (let i = 0; i < cancelButtons.length; i++) {
        const index = i;
        cancelButtons[i].addEventListener('click', function () {
            cancelEdit(index);
        });
    }

    const playerBtn = document.querySelector('.add-player-btn');
    playerBtn.addEventListener('click', showPlayerActive);

    const playerAddBtn = document.querySelector('.make-player-btn');
    playerAddBtn.addEventListener('click', addPlayer);
}

function toggleEditSection(index) {
    const editSection = document.querySelector(`.edit-section[data-index="${index}"]`);
    editSection.style.display = editSection.style.display === 'none' ? 'block' : 'none';
}

function savePlayerEdits(index) {
    const editSection = document.querySelector(`.edit-section[data-index="${index}"]`);

    const updatedUsername = editSection.querySelector('.edit-username').value;
    const updatedBio = editSection.querySelector('.edit-bio').value;
    const updatedTeam = editSection.querySelector('.edit-team').value;

    player[index].username = updatedUsername;
    player[index].bio = updatedBio;
    player[index].team = updatedTeam;

    localStorage.setItem('playerObj', JSON.stringify(player));

    showAllPlayers();
}

function cancelEdit(index) {
    const editSection = document.querySelector(`.edit-section[data-index="${index}"]`);
    editSection.style.display = 'none';
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

function showPlayerActive() {
    const playerActive = document.querySelector('.add-team');
    playerActive.classList.toggle('active');
}

function clearInputs() {
    document.querySelector('.team-input').value = '';
    document.querySelector('.username-input').value = '';
    document.querySelector('.bio-input').value = '';
}

