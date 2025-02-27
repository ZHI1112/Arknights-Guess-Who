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
  const randomSeed = Math.floor(
    100000000 + Math.random() * 900000000
  ).toString();
  document.getElementById("seedInput").value = randomSeed;
}

function copySeed() {
  const seed = document.getElementById("seedInput").value;
  const button = document.querySelector('button[onclick="copySeed()"]');
  const originalText = button.textContent;

  navigator.clipboard.writeText(seed).then(() => {
    button.textContent = "Copied!";
    button.style.backgroundColor = "ForestGreen";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 1000);
  });
}
function startGame() {
  if(isCustomMode) {
    if(selectedAvatars.length !== 24) {
      alert('Please select exactly 24 operators!');
      return;
    }
    startCustomGame();
  } else {
    if(!document.getElementById("seedInput").value.trim()) {
      alert('Please enter or generate a seed!');
      return;
    }
    startSeedGame();
  }
}

function startCustomGame() {
  const secretIndex = Math.floor(Math.random() * 24);
  const secretCharacter = selectedAvatars[secretIndex];

  const boardDiv = document.getElementById("board");
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

  // Hide custom selection UI
  document.getElementById("customSelectionUI").style.display = "none";

  // Show game elements
  document.getElementById("yourBoardText").style.display = "block";
  document.getElementById("yourOperatorText").style.display = "block";
  document.getElementById("startGameButton").style.display = "none";
  document.getElementById("endGameButton").style.display = "inline-block";
}

function startSeedGame() {
  let seedInput = document.getElementById("seedInput").value.trim();

  if (!seedInput) {
    seedInput = Math.floor(Math.random() * 1_000_000_000)
      .toString()
      .padStart(9, "0");
    document.getElementById("seedInput").value = seedInput;
  }

  let seed = 0;
  for (let i = 0; i < seedInput.length; i++) {
    seed = (seed * 31 + seedInput.charCodeAt(i)) % 1_000_000_000;
  }
  seed = seed.toString().padStart(9, "0");

  if (avatars.length < 24) {
    alert("Avatar list not loaded yet. Try again.");
    return;
  }

  let selectedAvatars = shuffleWithSeed(avatars, seed).slice(0, 24);

  // Use a more unique seed for the secret character selection
  let secretSeed = seed + performance.now(); // performance.now() provides higher precision
  let secretIndex = Math.floor(seededRandom(secretSeed) * 24);
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
  document.getElementById("startGameButton").style.display = "none";
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
  document.getElementById("startGameButton").style.display = "inline-block";

  document.getElementById("board").innerHTML = "";
  document.getElementById("secretCharacter").innerHTML = "";

  document.getElementById("yourBoardText").style.display = "none";
  document.getElementById("yourOperatorText").style.display = "none";

  document.getElementById("seedInput").value = "";

  // Reset custom selection UI if in custom mode
  if(isCustomMode) {
    document.getElementById("customSelectionUI").style.display = "block";
    selectedAvatars = [];
    populateAvatarPool();
    document.getElementById('selectionCounter').textContent = 'Selected: 0/24';
  }
}

let isCustomMode = false;
let selectedAvatars = [];

function toggleMode() {
  // End the current game if switching modes
  if (document.getElementById("endGameButton").style.display !== "none") {
    endGame();
  }

  isCustomMode = !isCustomMode;
  document.body.classList.toggle('custom-mode', isCustomMode);
  
  const modeToggle = document.getElementById('modeToggle');
  const customUI = document.getElementById('customSelectionUI');
  const inputContainer = document.querySelector('.input-container');
  
  modeToggle.textContent = isCustomMode ? 'Switch to Seed Mode' : 'Switch to Custom Mode';
  customUI.style.display = isCustomMode ? 'block' : 'none';
  inputContainer.style.display = isCustomMode ? 'none' : 'flex';
  
  if(isCustomMode) {
    populateAvatarPool();
  } else {
    // Reset custom mode selections when switching back to seed mode
    selectedAvatars = [];
    document.getElementById('selectionCounter').textContent = 'Selected: 0/24';
  }
}

function populateAvatarPool() {
  const pool = document.getElementById("avatarPool");
  pool.innerHTML = "";

  avatars.forEach((avatar) => {
    const img = document.createElement("img");
    img.src = "avatars/" + avatar;
    img.classList.add("avatar-selectable");

    // Add selected class if already in selectedAvatars
    if (selectedAvatars.includes(avatar)) {
      img.classList.add("avatar-selected");
    }

    img.onclick = () => toggleSelection(avatar, img);
    pool.appendChild(img);
  });

  // Update counter display
  document.getElementById(
    "selectionCounter"
  ).textContent = `Selected: ${selectedAvatars.length}/24`;
}

function toggleSelection(avatar, img) {
  const index = selectedAvatars.indexOf(avatar);

  if (index === -1) {
    if (selectedAvatars.length >= 24) return;
    selectedAvatars.push(avatar);
    img.classList.add("avatar-selected");
  } else {
    selectedAvatars.splice(index, 1);
    img.classList.remove("avatar-selected");
  }

  document.getElementById(
    "selectionCounter"
  ).textContent = `Selected: ${selectedAvatars.length}/24`;
}
