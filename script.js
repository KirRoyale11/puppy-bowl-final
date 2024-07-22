// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2404-FTB-ET-WEB-AM";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

const playersContainer = document.querySelector("main");

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const closeModal = document.querySelector("#close-modal");

const addNewPlayerForm = document.querySelector("#new-player-form");

modal.addEventListener("click", function (e) {
  // closes modal when you click outside the content area of the modal
  console.log(e.target.classList);
  if (!e.target.classList.contains("modal-content")) {
    modalContent.classList.remove("modal-content-open");
    modal.classList.remove("modal-open");
    modalContent.innerHTML = "";
  }
});

modalContent.addEventListener("click", function (e) {
  e.stopPropagation();
});

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const result = await response.json();
    console.log(result);
    return result.data.players;
  } catch (err) {
    console.error("Ruh roh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const result = await response.json();
    return result.data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};


const addNewPlayer = async (playerObj) => {
  try {
//TODO
    const response = await fetch(`${API_URL}/players/`, {
      method: "POST",
      body: JSON.stringify(playerObj),
      headers: { "Content-type": "application/json" },
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};


const renderAllPlayers = (playerList) => {
  try {
    const playerCards = playerList.map((player) => {
      const playerCard = document.createElement("div");
      const playerImg = document.createElement("img");
      const playerName = document.createElement("p");
      const detailsButton = document.createElement("button");

      playerCard.classList.add("player-card-container");

      playerImg.src = player.imageUrl;
      (playerImg.alt = player.name, player.breed);
      playerName.innerText = player.name;
      detailsButton.innerText = "More About Player";
      detailsButton.addEventListener("click", async function () {
        const playerData = await fetchSinglePlayer(player.id);
        console.log(playerData);
        renderSinglePlayer(playerData);
      });

      playerCard.appendChild(playerImg);
      playerCard.appendChild(playerName);
      playerCard.appendChild(detailsButton);

      return playerCard;
    });

    playersContainer.replaceChildren(...playerCards);

    console.log(playerCards);
  } catch (error) {
    console.log(error);
  }
};

const renderSinglePlayer = async (player) => {
  // TODO
  try {
    const playerImg = document.createElement("img");
    const playerName = document.createElement("h3");
    const playerBreed = document.createElement("p");
    const playerStatus = document.createElement("p");
    const deleteButton = document.createElement("button");
    playerImg.src = player.imageUrl;
    playerImg.height = 300;
    playerName.innerText = player.name;
    playerBreed.innerText = player.breed;
    playerStatus.innerText = player.status;
    deleteButton.innerText = "Remove Player";
    deleteButton.addEventListener("click", async (e) => {
      // e.stopPropagation();
      modal.classList.remove("modal-open");
      modalContent.classList.remove("modal-content-open");
      await removePlayer(player.id);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
    modalContent.replaceChildren(
      playerName,
      playerImg,
      playerBreed,
      playerStatus,
      deleteButton
    );
    modal.classList.add("modal-open");
    modalContent.classList.add("modal-content-open");
  } catch (error) {
    
    console.error("Woof! Could not render single player");
  }
};

const renderNewPlayerForm = () => {
  try {
    // TODO
    const nameInput = document.createElement("input");
    const nameLabel = document.createElement("label");
    const imgInput = document.createElement("input");
    const imgLabel = document.createElement("label");
    const breedInput = document.createElement("input");
    const breedLabel = document.createElement("label");
    const status = document.createElement("select");
    const statusLabel = document.createElement("label");
    const benchOption = document.createElement("option");
    const fieldOption = document.createElement("option");

    nameInput.setAttribute("id", "playername");
    nameLabel.innerText = "Name";
    nameLabel.setAttribute("for", "playername");

    imgInput.setAttribute("id", "img");
    imgLabel.innerText = "Image Url";
    imgLabel.setAttribute("for", "img");

    breedInput.setAttribute("id", "breed");
    breedLabel.innerText = "Breed";
    breedLabel.setAttribute("for", "breed");

    status.setAttribute("id", "playerstatus");
    //   statusLabel.innerText = "Status";
    //   statusLabel.setAttribute("for", "status");

    status.appendChild(benchOption);
    benchOption.value = "bench";
    benchOption.innerText = "Bench";
    benchOption.setAttribute("selected", "");

    status.appendChild(fieldOption);
    fieldOption.value = "field";
    fieldOption.innerText = "Field";

    const submitButton = document.createElement("button");
    submitButton.innerText = "Add New Player";

    addNewPlayerForm.replaceChildren(
      nameLabel,
      nameInput,
      imgLabel,
      imgInput,
      breedLabel,
      breedInput,
      statusLabel,
      status,
      submitButton
    );

    addNewPlayerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const newPlayer = {
        name: playername.value,
        imageUrl: img.value,
        breed: breed.value,
        status: playerstatus.value,
      };
      const result = await addNewPlayer(newPlayer);
      if (result.success) {
        alert("Player successfully added!");
        playername.value = "";
        img.value="";
        breed.value="";

        const players = await fetchAllPlayers();
        renderAllPlayers(players);
      } else if (result.error) {
        console.log("Error creating player.");
      }
    });
  } catch (err) {
    console.log("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();
