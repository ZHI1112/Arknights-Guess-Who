let avatars = [];
let isCustomMode = false;
let selectedAvatars = [];

fetch("avatars.json")
  .then((response) => response.json())
  .then((data) => {
    avatars = data;
  });

function updateInstructions() {
  const instructionList = document.getElementById("instructionList");

  if (isCustomMode) {
    instructionList.innerHTML = `
      <li>Select or load a selection with a code</li>
      <li>Share the generated selection code with your opponent</li>
      <li>Press "Start Game" to begin</li>
    `;
  } else {
    instructionList.innerHTML = `
      <li>Enter or generate a board seed</li>
      <li>Share the board seed with your opponent</li>
      <li>Press "Start Game" to begin</li>
    `;
  }
}


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

  if (!seed) {
    alert("No seed to copy!");
    return;
  }

  navigator.clipboard.writeText(seed).then(() => {
    button.textContent = "Copied!";
    button.style.backgroundColor = "ForestGreen";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 1000);
  });
}

function generateCustomSelectedCode() {
  if (selectedAvatars.length < 24) {
    alert("Please select at least 24 operators!");
    return;
  }

  const indices = selectedAvatars
    .map((avatar) => avatars.indexOf(avatar))
    .join(",");
  const code = btoa(indices);
  document.getElementById("customCodeInput").value = code;
}

function applyCustomSelectedCode() {
  const code = document.getElementById("customCodeInput").value.trim();
  if (!code) {
    alert("Please enter a Custom Selection Code!");
    return;
  }

  try {
    const indices = atob(code)
      .split(",")
      .map((num) => parseInt(num));
    selectedAvatars = indices.map((index) => avatars[index]).filter(Boolean);

    if (selectedAvatars.length < 24) {
      alert(
        "Invalid or incomplete selection. Make sure at least 24 valid operators are selected."
      );
      return;
    }

    populateAvatarPool();
    document.getElementById(
      "selectionCounter"
    ).textContent = `Selected: ${selectedAvatars.length}`;
  } catch (e) {
    alert("Invalid Custom Selected Code!");
  }
}

function copyCustomCode() {
  const code = document.getElementById("customCodeInput").value;
  const button = document.querySelector('button[onclick="copyCustomCode()"]');
  const originalText = button.textContent;

  if (!code) {
    alert("No Custom Selected Code to copy!");
    return;
  }

  navigator.clipboard.writeText(code).then(() => {
    button.textContent = "Copied!";
    button.style.backgroundColor = "ForestGreen";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 1000);
  });
}

function toggleHide(img) {
  img.classList.toggle("hidden");
}

function startGame() {
  if (isCustomMode) {
    if (selectedAvatars.length < 24) {
      alert("Please select at least 24 operators!");
      return;
    }
    startCustomGame();
  } else {
    if (!document.getElementById("seedInput").value.trim()) {
      alert("Please enter or generate a seed!");
      return;
    }
    startSeedGame();
  }

  document.getElementById("selectAllButton").style.display = "none";
}

function startCustomGame() {
  const secretIndex = Math.floor(Math.random() * selectedAvatars.length);
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

  document.getElementById("customSelectionUI").style.display = "none";
  document.getElementById("yourBoardText").style.display = "block";
  document.getElementById("yourOperatorText").style.display = "block";
  document.getElementById("startGameButton").style.display = "none";
  document.getElementById("endGameButton").style.display = "inline-block";
}

function startSeedGame() {
  let seedInput = document.getElementById("seedInput").value.trim();

  if (!seedInput) {
    seedInput = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, "0");
    document.getElementById("seedInput").value = seedInput;
  }

  let seed = 0;
  for (let i = 0; i < seedInput.length; i++) {
    seed = (seed * 31 + seedInput.charCodeAt(i)) % 1000000000;
  }
  seed = seed.toString().padStart(9, "0");

  if (avatars.length < 24) {
    alert("Avatar list not loaded yet. Try again.");
    return;
  }

  let selectedAvatars = shuffleWithSeed(avatars, seed).slice(0, 24);

  let secretSeed = seed + performance.now();
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

function selectAllAvatars() {
  if (selectedAvatars.length === avatars.length) {
    selectedAvatars = [];
  } else {
    selectedAvatars = [...avatars];
  }

  populateAvatarPool();
  document.getElementById(
    "selectionCounter"
  ).textContent = `Selected: ${selectedAvatars.length}`;
}

function endGame() {
  document.getElementById("endGameButton").style.display = "none";
  document.getElementById("startGameButton").style.display = "inline-block";

  document.getElementById("board").innerHTML = "";
  document.getElementById("secretCharacter").innerHTML = "";

  document.getElementById("yourBoardText").style.display = "none";
  document.getElementById("yourOperatorText").style.display = "none";

  document.getElementById("seedInput").value = "";

  if (isCustomMode) {
    document.getElementById("customSelectionUI").style.display = "block";
    populateAvatarPool();
    document.getElementById(
      "selectionCounter"
    ).textContent = `Selected: ${selectedAvatars.length}`;
    document.getElementById("selectAllButton").style.display = "inline-block";
  }
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

function toggleMode() {
  if (document.getElementById("endGameButton").style.display !== "none") {
    endGame();
  }

  isCustomMode = !isCustomMode;
  document.body.classList.toggle("custom-mode", isCustomMode);

  const modeToggle = document.getElementById("modeToggle");
  const customUI = document.getElementById("customSelectionUI");
  const inputContainer = document.querySelector(".input-container");

  modeToggle.textContent = isCustomMode
    ? "Switch to Seed Mode"
    : "Switch to Custom Mode";
  customUI.style.display = isCustomMode ? "block" : "none";
  inputContainer.style.display = isCustomMode ? "none" : "flex";

  if (isCustomMode) {
    document.getElementById("selectAllButton").style.display = "inline-block";
    populateAvatarPool();
  } else {
    selectedAvatars = [];
    document.getElementById("selectionCounter").textContent = "Selected: 0";
    document.getElementById("selectAllButton").style.display = "none";
  }
  
  updateInstructions();
}

function populateAvatarPool() {
  const pool = document.getElementById("avatarPool");
  pool.innerHTML = "";

  avatars.forEach((avatar) => {
    const img = document.createElement("img");
    img.src = "avatars/" + avatar;
    img.classList.add("avatar-selectable");

    if (selectedAvatars.includes(avatar)) {
      img.classList.add("avatar-selected");
    }

    img.onclick = () => toggleSelection(avatar, img);
    pool.appendChild(img);
  });

  document.getElementById(
    "selectionCounter"
  ).textContent = `Selected: ${selectedAvatars.length}`;
}

function toggleSelection(avatar, img) {
  const index = selectedAvatars.indexOf(avatar);

  if (index === -1) {
    selectedAvatars.push(avatar);
    img.classList.add("avatar-selected");
  } else {
    selectedAvatars.splice(index, 1);
    img.classList.remove("avatar-selected");
  }

  document.getElementById(
    "selectionCounter"
  ).textContent = `Selected: ${selectedAvatars.length}`;
}

document.addEventListener("DOMContentLoaded", updateInstructions);
