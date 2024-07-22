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

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
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

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
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

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    // TODO
    // alert("Adding New Player"); SUCCESS
    const response = await fetch(`${API_URL}/players/`, {
        method:"POST",
        body:JSON.stringify(playerObj),
        headers:{"Content-type": "application/json"},
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
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

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  try {
    const playerCards = playerList.map((player) => {
      const playerCard = document.createElement("div");
      const playerImg = document.createElement("img");
      const playerName = document.createElement("p");
      const detailsButton = document.createElement("button");

      playerCard.classList.add("player-card-container");

      playerImg.src = player.imageUrl;
      (playerImg.alt = player.name), player.breed;
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

  // TODO

  // when you add a event handler to the buttons, you need to pass an id of the player
  // to the function renderSinglePlayer or removePlayer
  /*
     ...your code(player=>{
      // more code...
        deleteButton.addEventListener("click", function(){
          removePlayer(player.id);
        })
      })

        // TODO
    /* Remember, if you're using the modal, when you create the details button,
    in th event handler, create functionality that adds the class 'modal-open' to the modal var and 'modal-content-open' to the
    modalContent var */
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
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
      modalContainer.classList.remove("modal-content-open");
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
    console.log(error);
    console.log("Woof! Could not render single player");
  }
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
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
  

  addNewPlayerForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const newPlayer = {
        name: playername.value,
        imageUrl: imgInput.value,
        breed: breed.value,
        status: playerstatus.value,

    };
    const result = await addNewPlayer(newPlayer);
    if(result.success) {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
} else if (result.error){
    console.log("error creating player");
}
  });

  
  } catch (err) {
    console.log("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();
