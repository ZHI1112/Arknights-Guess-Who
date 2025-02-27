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
  const randomSeed = Math.floor(100000000 + Math.random() * 900000000).toString(); 
  document.getElementById("seedInput").value = randomSeed;
}

function copySeed() {
  const seed = document.getElementById("seedInput").value;
  navigator.clipboard.writeText(seed).then(() => {
  });
}

function startGame() {
  let seedInput = document.getElementById("seedInput").value;

  if (!seedInput || seedInput.length !== 9 || isNaN(seedInput)) {
    seedInput = Math.floor(100000000 + Math.random() * 900000000).toString();
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

  let selectedAvatars = shuffleWithSeed(avatars, seed).slice(0, 24);
  let playerSpecificSeed = seed + Date.now();
  let secretIndex = Math.floor(seededRandom(playerSpecificSeed) * 24);
  let secretCharacter = selectedAvatars[secretIndex];

  let boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  selectedAvatars.forEach((avatar) => {
    let img = document.createElement("img");
    img.src = "avatars/" + avatar;
    img.classList.add("avatar");
    img.onclick = () => toggleHide(img);
    boardDiv.appendChild(img);
  });

  let secretDiv = document.getElementById("secretCharacter");
  secretDiv.innerHTML = `<img src="avatars/${secretCharacter}" class="secret-avatar">`;

  document.getElementById("yourBoardText").style.display = "block";
  document.getElementById("yourOperatorText").style.display = "block";

  document.querySelector('button[onclick="startGame()"]').style.display = "none";
  document.getElementById("endGameButton").style.display = "inline-block";
}

function toggleHide(img) {
  img.classList.toggle("hidden");
}

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

document.body.classList.add("dark-mode");

function endGame() {
  document.getElementById("endGameButton").style.display = "none";
  document.querySelector('button[onclick="startGame()"]').style.display = "inline-block";

  document.getElementById("board").innerHTML = "";
  document.getElementById("secretCharacter").innerHTML = "";

  document.getElementById("yourBoardText").style.display = "none";
  document.getElementById("yourOperatorText").style.display = "none";

  document.getElementById("seedInput").value = ""; 
}

