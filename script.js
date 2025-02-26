// Load the avatars and set up the game based on a seed
let avatars = [];

fetch("avatars.json")
  .then((response) => response.json())
  .then((data) => {
    avatars = data;
  });

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleWithSeed(array, seed) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateRandomSeed() {
  const randomSeed = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  document.getElementById("seedInput").value = randomSeed;
}

function copySeed() {
  const seed = document.getElementById("seedInput").value;
  navigator.clipboard.writeText(seed).then(() => {
  });
}

function startGame() {
  let seedInput = document.getElementById("seedInput").value;

  // If the seed input is empty, generate a random seed
  if (!seedInput) {
    seedInput = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    document.getElementById("seedInput").value = seedInput;
  } else {
    // Ensure the input seed is exactly 6 characters long
    seedInput = seedInput.padStart(6, "0").slice(0, 6);
    document.getElementById("seedInput").value = seedInput;
  }

  let seed = 0;
  for (let i = 0; i < seedInput.length; i++) {
    seed += seedInput.charCodeAt(i);
  }

  if (avatars.length < 24) {
    alert("Avatar list not loaded yet. Try again.");
    return;
  }

  // Pick 24 avatars based on seed
  let selectedAvatars = shuffleWithSeed(avatars, seed).slice(0, 24);

  // Different secret character per player
  let playerSpecificSeed = seed + Date.now(); // Slight variation per player
  let secretIndex = Math.floor(seededRandom(playerSpecificSeed) * 24);
  let secretCharacter = selectedAvatars[secretIndex];

  // Display the board
  let boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  selectedAvatars.forEach((avatar) => {
    let img = document.createElement("img");
    img.src = "avatars/" + avatar;
    img.classList.add("avatar");
    img.onclick = () => toggleHide(img);
    boardDiv.appendChild(img);
  });

  // Display secret character
  let secretDiv = document.getElementById("secretCharacter");
  secretDiv.innerHTML = `<img src="avatars/${secretCharacter}" class="secret-avatar">`;

  // Hide "Your Board" and "Your Operator" text
  document.getElementById("yourBoardText").style.display = "block";
  document.getElementById("yourOperatorText").style.display = "block";

  // Hide the "Start Game" button
  document.querySelector('button[onclick="startGame()"]').style.display = "none";

  // Show the "End Game" button
  document.getElementById("endGameButton").style.display = "inline-block";
}

// Toggle hiding an avatar when clicked
function toggleHide(img) {
  img.classList.toggle("hidden");
}

// Dark/Light Mode toggle function
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
  }
}

// Set default mode to dark mode
document.body.classList.add("dark-mode");

// End Game functionality
function endGame() {
  // Hide the "End Game" button and show "Start Game" again
  document.getElementById("endGameButton").style.display = "none";
  document.querySelector('button[onclick="startGame()"]').style.display =
    "inline-block";

  // Clear the board and secret character display
  document.getElementById("board").innerHTML = "";
  document.getElementById("secretCharacter").innerHTML = "";

  // Hide the "Your Board" and "Your Operator" texts
  document.getElementById("yourBoardText").style.display = "none";
  document.getElementById("yourOperatorText").style.display = "none";
}
