let player = [];
let selectedColor = null;
const chngPlayerBtn = document
  .querySelector(".change-player")
  .addEventListener("click", changeActivePlayer);

const buttonHtml = `<button class="btn btn-primary btn-sm add-player-btn">Add new player</button>`;
const addPlayerHtml = ` <div class="add-team">
<div class="input-group input-group-sm mb-3">
    <span class="input-group-text" id="inputGroup-sizing-sm">Add team</span>
    <input type="text" class="form-control team-input" aria-label="Sizing example input" placeholder="Add team name" aria-describedby="inputGroup-sizing-sm">
  </div>
  <div class="input-group input-group-sm mb-3">
    <span class="input-group-text" id="inputGroup-sizing-sm">Add username</span>
    <input type="text" class="form-control username-input" aria-label="Sizing example input" placeholder="Add username" aria-describedby="inputGroup-sizing-sm">
  </div>
  <div class="input-group input-group-sm mb-3">
    <span class="input-group-text" id="inputGroup-sizing-sm">Add bio</span>
    <input type="text" class="form-control bio-input" aria-label="Sizing example input" placeholder="Add bio" aria-describedby="inputGroup-sizing-sm">
  </div>
            <div class="team-color">
            <p> Add team color</p>
            <input type="color" class="color-picker"> 
            </div>
                  <button class="btn btn-secondary btn-sm make-player-btn">Make player</button>
        </div>`;

checkLocalStorage();

function checkLocalStorage() {
  const storedPlayers = JSON.parse(localStorage.getItem("playerObj"));
  if (storedPlayers) {
    player = storedPlayers;
  } else {
    player.push(
      makePlayer(
        "yellow",
        "Yellow team",
        0,
        0,
        "This is a placeholder bio.",
        "#ffff00"
      )
    );
    player.push(
      makePlayer(
        "red",
        "Red team",
        0,
        0,
        "This is another placeholder bio.",
        "#ff0000"
      )
    );
    localStorage.setItem("playerObj", JSON.stringify(player));
    location.reload();
  }
  showAllPlayers();
}

function changeActivePlayer() {
  startSreen.style.display = "flex";
  let getLatestPlayers = JSON.parse(localStorage.getItem("playerObj"));
  playerOne.innerHTML = ``;
  playerTwo.innerHTML = ``;
  selectedPlayerOne = null;
  selectedPlayerTwo = null;

  for (let i = 0; i < getLatestPlayers.length; i++) {
    const player = getLatestPlayers[i];
    playerOne.innerHTML += `<option value="${player.username}">${player.username}</option>`;
    playerTwo.innerHTML += `<option value="${player.username}">${player.username}</option>`;
  }
  loadBoard();
  console.log(selectedPlayerTwo.color);
  console.log(selectedPlayerOne.color);
  if (settingsWindow.classList.contains("active")) {
    settingsWindow.classList.toggle("active");
  }
}

function makePlayer(team, username, level, xp, bio, color) {
  const player = {
    team: team,
    username: username,
    level: level,
    xp: xp,
    bio: bio,
    color: color,
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
        ${"Level: " + players.level + " | " + players.xp + " xp"}
    </div>
    <div class="color">
        ${"Team color: " + players.color}
        </div>
    <button class="btn btn-secondary btn-sm delete-player" data-index="${i}"> Delete player</button>
    <button class="btn btn-secondary btn-sm edit-btn" data-index="${i}">Edit</button>
    <div class="edit-section" data-index="${i}">
<div class="input-group input-group-sm mb-3">
    <span class="input-group-text" id="inputGroup-sizing-sm">Edit username</span>
    <input type="text" class="form-control edit-username" aria-label="Sizing example input" value="${players.username
      }" aria-describedby="inputGroup-sizing-sm">
  </div>
        <div class="input-group input-group-sm mb-3">
    <span class="input-group-text" id="inputGroup-sizing-sm">Edit bio</span>
    <input type="text" class="form-control edit-bio" aria-label="Sizing example input" value="${players.bio
      }" aria-describedby="inputGroup-sizing-sm">
  </div>
       <div class="input-group input-group-sm mb-3">
    <span class="input-group-text" id="inputGroup-sizing-sm">Edit team</span>
    <input type="text" class="form-control edit-team" aria-label="Sizing example input" value="${players.team
      }" aria-describedby="inputGroup-sizing-sm">
  </div>
        <div class="team-color">
            <p> Change team color</p>
            <input type="color" class="change-color" value="${players.color}"> 
            </div>
        <button class="btn btn-secondary btn-sm save-btn" data-index="${i}">Save</button>
        <button class="btn btn-secondary btn-sm cancel-btn" data-index="${i}">Cancel</button>
    </div>
</div>`;
  }

  settingsWindow.innerHTML = newInnerHTML + buttonHtml + addPlayerHtml;

  const editButtons = document.querySelectorAll(".edit-btn");
  for (let i = 0; i < editButtons.length; i++) {
    const index = i;
    editButtons[i].addEventListener("click", function () {
      toggleEditSection(index);
    });
  }

  const saveButtons = document.querySelectorAll(".save-btn");
  for (let i = 0; i < saveButtons.length; i++) {
    const index = i;
    saveButtons[i].addEventListener("click", function () {
      savePlayerEdits(index);
    });
  }

  const cancelButtons = document.querySelectorAll(".cancel-btn");
  for (let i = 0; i < cancelButtons.length; i++) {
    const index = i;
    cancelButtons[i].addEventListener("click", function () {
      cancelEdit(index);
    });
  }

  const deleteButtons = document.querySelectorAll(".delete-player");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function () {
      deletePlayer(i);
    });
  }

  const playerBtn = document.querySelector(".add-player-btn");
  playerBtn.addEventListener("click", showPlayerActive);

  const playerAddBtn = document.querySelector(".make-player-btn");
  playerAddBtn.addEventListener("click", addPlayer);
}

function toggleEditSection(index) {
  const editSection = document.querySelector(
    `.edit-section[data-index="${index}"]`
  );
  editSection.classList.toggle("active");
}

function savePlayerEdits(index) {
  const editSection = document.querySelector(
    `.edit-section[data-index="${index}"]`
  );

  const updatedUsername = editSection.querySelector(".edit-username").value;
  const updatedBio = editSection.querySelector(".edit-bio").value;
  const updatedTeam = editSection.querySelector(".edit-team").value;
  const updatedColor = editSection.querySelector(".change-color").value;

  player[index].username = updatedUsername;
  player[index].bio = updatedBio;
  player[index].team = updatedTeam;
  player[index].color = updatedColor;

  localStorage.setItem("playerObj", JSON.stringify(player));

  showAllPlayers();
}

function cancelEdit(index) {
  const editSection = document.querySelector(
    `.edit-section[data-index="${index}"]`
  );
  editSection.style.display = "none";
}

function deletePlayer(i) {
  let playerObj = JSON.parse(localStorage.getItem("playerObj"));
  playerObj.splice(i, 1);
  localStorage.setItem("playerObj", JSON.stringify(playerObj));
  player = playerObj;
  showAllPlayers();
}

function addPlayer() {
  const inputValueTeam = document.querySelector(".team-input").value;
  const inputValueUsername = document.querySelector(".username-input").value;
  const inputValueBio = document.querySelector(".bio-input").value;
  selectedColor = document.querySelector(".color-picker").value;

  if (!inputValueTeam || !inputValueUsername || !inputValueBio) {
    alert("Please fill out all fields!");
    return;
  }

  if (!selectedColor) {
    alert("Please select a team color!!");
    return;
  }
  const newPlayer = makePlayer(
    inputValueTeam,
    inputValueUsername,
    0,
    0,
    inputValueBio,
    selectedColor
  );
  player.push(newPlayer);
  localStorage.setItem("playerObj", JSON.stringify(player));

  showAllPlayers();
  clearInputs();
}

function showPlayerActive() {
  const playerActive = document.querySelector(".add-team");
  playerActive.classList.toggle("active");
}

function clearInputs() {
  document.querySelector(".team-input").value = "";
  document.querySelector(".username-input").value = "";
  document.querySelector(".bio-input").value = "";
}
