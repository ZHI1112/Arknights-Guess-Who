let avatars = [];
let isCustomMode = false;
let selectedAvatars = [];

// Fetch avatars data
fetch("avatars.json")
  .then((response) => response.json())
  .then((data) => {
    avatars = data;
  });

// Translations for different languages
const translations = {
  en: {
    title: "Arknights Guess Who",
    howToPlay: "How to Play",
    instructions: [
      "Enter or generate a board seed",
      "Share the board seed with your opponent",
      "Press 'Start Game' to begin",
    ],
    instructionsCustom: [
      "Select or load a selection with a code",
      "Share the generated selection code with your opponent",
      "Press 'Start Game' to begin",
    ],
    enterSeed: "Enter Seed:",
    generateSeed: "Generate Seed",
    copySeed: "Copy Seed",
    generateCode: "Generate Code",
    copyCode: "Copy Code",
    startGame: "Start Game",
    customBoard: "Create Custom Board",
    endGame: "End Game",
    yourBoard: "Your Board",
    yourOperator: "Your Operator",
    selectOperators: "Select At Least 24 Operators",
    startCustomGame: "Start Custom Game",
    switchToSeedMode: "Switch to Seed Mode",
    switchToCustomMode: "Switch to Custom Mode",
    selectionCodeLabel: "Selection Code:",
    pasteOrGenerateSeed: "Paste or generate seed",
    pasteOrGenerateCode: "Paste or generate code",
    loadSelection: "Load Selection",
    selected: "Selected: ",
    copied: "Copied!",
    noSeedToCopy: "No seed to copy!",
    noCustomCodeToCopy: "No Custom Selected Code to copy!",
    selectAtLeast24Operators: "Please select at least 24 operators!",
    enterOrGenerateSeed: "Please enter or generate a seed!",
    invalidSelection:
      "Invalid or incomplete selection. Make sure at least 24 operators are selected.",
    invalidCustomCode: "Invalid Custom Selected Code!",
    avatarListNotLoaded: "Avatar list not loaded yet. Try again.",
  },
  jp: {
    title: "アークナイツ ゲスフー",
    howToPlay: "遊び方",
    instructions: [
      "ボードのシードを入力または生成する",
      "対戦相手とボードのシードを共有する",
      "「ゲーム開始」ボタンを押して始める",
    ],
    instructionsCustom: [
      "コードで選択をロードまたは選択する",
      "生成された選択コードを相手と共有する",
      "「ゲーム開始」ボタンを押して始める",
    ],
    enterSeed: "シードを入力:",
    generateSeed: "シード生成",
    copySeed: "シードコピー",
    generateCode: "コード生成",
    copyCode: "コードコピー",
    startGame: "ゲーム開始",
    customBoard: "カスタムボード作成",
    endGame: "ゲーム終了",
    yourBoard: "あなたのボード",
    yourOperator: "あなたのオペレーター",
    selectOperators: "少なくとも24人のオペレーターを選択",
    startCustomGame: "カスタムゲーム開始",
    switchToSeedMode: "シードモードに切り替え",
    switchToCustomMode: "カスタムモードに切り替え",
    selectionCodeLabel: "選択コード:",
    pasteOrGenerateSeed: "シードを入力",
    pasteOrGenerateCode: "コードを入力",
    loadSelection: "選択をロード",
    selected: "選択済み: ",
    copied: "コピー済み！",
    noSeedToCopy: "コピーするシードがありません！",
    noCustomCodeToCopy: "カスタム選択コードがありません！",
    selectAtLeast24Operators:
      "少なくとも24人のオペレーターを選択してください！",
    enterOrGenerateSeed: "シードを入力または生成してください！",
    invalidSelection:
      "無効または不完全な選択です。少なくとも24人の有効なオペレーターを選択してください。",
    invalidCustomCode: "無効なカスタム選択コードです！",
    avatarListNotLoaded:
      "アバターリストがまだ読み込まれていません。もう一度お試しください。",
  },
  kr: {
    title: "아크나이츠 게스후",
    howToPlay: "게임 방법",
    instructions: [
      "보드 시드를 입력하거나 생성하세요",
      "보드 시드를 상대와 공유하세요",
      "'게임 시작' 버튼을 눌러 시작하세요",
    ],
    instructionsCustom: [
      "코드로 선택을 로드하거나 선택하세요",
      "생성된 선택 코드를 상대와 공유하세요",
      "'게임 시작' 버튼을 눌러 시작하세요",
    ],
    enterSeed: "시드 입력:",
    generateSeed: "시드 생성",
    copySeed: "시드 복사",
    generateCode: "코드 생성",
    copyCode: "코드 복사",
    startGame: "게임 시작",
    customBoard: "커스텀 보드 만들기",
    endGame: "게임 종료",
    yourBoard: "당신의 보드",
    yourOperator: "당신의 오퍼레이터",
    selectOperators: "최소24명의 오퍼레이터를 선택하세요",
    startCustomGame: "커스텀 게임 시작",
    switchToSeedMode: "시드 모드로 전환",
    switchToCustomMode: "커스텀 모드로 전환",
    selectionCodeLabel: "선택 코드:",
    pasteOrGenerateSeed: "시드 입력",
    pasteOrGenerateCode: "코드 입력",
    loadSelection: "선택 로드",
    selected: "선택됨: ",
    copied: "복사됨!",
    noSeedToCopy: "복사할 시드가 없습니다!",
    noCustomCodeToCopy: "복사할 커스텀 선택 코드가 없습니다!",
    selectAtLeast24Operators: "최소 24명의 오퍼레이터를 선택하세요!",
    enterOrGenerateSeed: "시드를 입력하거나 생성하세요!",
    invalidSelection:
      "잘못되었거나 불완전한 선택입니다. 최소 24명의 유효한 오퍼레이터를 선택하세요.",
    invalidCustomCode: "잘못된 커스텀 선택 코드입니다!",
    avatarListNotLoaded:
      "아바타 목록이 아직 로드되지 않았습니다. 다시 시도하세요.",
  },
  cn: {
    title: "明日方舟 猜猜我是谁",
    howToPlay: "如何游玩",
    instructions: [
      "输入或生成棋盘种子",
      "与对手分享棋盘种子",
      "点击“开始游戏”按钮开始",
    ],
    instructionsCustom: [
      "选择或加载一个选择代码",
      "与对手分享生成的选择代码",
      "点击“开始游戏”按钮开始",
    ],
    enterSeed: "输入种子:",
    generateSeed: "生成种子",
    copySeed: "复制种子",
    generateCode: "生成代码",
    copyCode: "复制代码",
    startGame: "开始游戏",
    customBoard: "创建自定义棋盘",
    endGame: "结束游戏",
    yourBoard: "你的棋盘",
    yourOperator: "你的干员",
    selectOperators: "选择至少24名干员",
    startCustomGame: "开始自定义游戏",
    switchToSeedMode: "切换到种子模式",
    switchToCustomMode: "切换到自定义模式",
    selectionCodeLabel: "选择代码:",
    pasteOrGenerateSeed: "粘贴或生成种子",
    pasteOrGenerateCode: "粘贴或生成代码",
    loadSelection: "加载选择",
    selected: "已选择: ",
    copied: "已复制！",
    noSeedToCopy: "没有种子可复制！",
    noCustomCodeToCopy: "没有自定义选择代码可复制！",
    selectAtLeast24Operators: "请选择至少24名干员！",
    enterOrGenerateSeed: "请输入或生成种子！",
    invalidSelection: "无效或不完整的选择。请确保至少选择24名干员。",
    invalidCustomCode: "无效的自定义选择代码！",
    avatarListNotLoaded: "干员列表尚未加载，请重试。",
  },
};

// Apply translations based on selected language
function applyTranslations(lang) {
  const langData = translations[lang];

  document.querySelector("h1").textContent = langData.title;
  document.querySelector("#instructions h2").textContent = langData.howToPlay;
  updateInstructions();

  document.querySelector('label[for="seedInput"]').textContent =
    langData.enterSeed;
  document.getElementById("seedInput").placeholder =
    langData.pasteOrGenerateSeed;

  document.querySelector('button[onclick="generateRandomSeed()"]').textContent =
    langData.generateSeed;
  document.querySelector('button[onclick="copySeed()"]').textContent =
    langData.copySeed;

  document.querySelector(
    'button[onclick="generateCustomSelectedCode()"]'
  ).textContent = langData.generateCode;
  document.querySelector('button[onclick="copyCustomCode()"]').textContent =
    langData.copyCode;

  document.querySelector("#customSelectionUI h2").textContent =
    langData.selectOperators;
  document.querySelector('label[for="customCodeInput"] strong').textContent =
    langData.selectionCodeLabel;
  document.getElementById("customCodeInput").placeholder =
    langData.pasteOrGenerateCode;
  document.querySelector(
    'button[onclick="applyCustomSelectedCode()"]'
  ).textContent = langData.loadSelection;

  document.getElementById("selectionCounter").textContent =
    langData.selected + selectedAvatars.length;

  document.getElementById("startGameButton").textContent = langData.startGame;
  document.getElementById("endGameButton").textContent = langData.endGame;

  document.getElementById("yourBoardText").textContent = langData.yourBoard;
  document.getElementById("yourOperatorText").textContent =
    langData.yourOperator;

  const modeToggle = document.getElementById("modeToggle");
  modeToggle.textContent = isCustomMode
    ? langData.switchToSeedMode
    : langData.switchToCustomMode;

  localStorage.setItem("selectedLanguage", lang);
}

// Update instructions based on mode and language
function updateInstructions() {
  const instructionList = document.getElementById("instructionList");
  const selectedLang = document.getElementById("langSelect").value;
  const langData = translations[selectedLang];
  instructionList.innerHTML = isCustomMode
    ? langData.instructionsCustom.map((text) => `<li>${text}</li>`).join("")
    : langData.instructions.map((text) => `<li>${text}</li>`).join("");
}

// Initialize language on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "en";
  document.getElementById("langSelect").value = savedLang;
  applyTranslations(savedLang);
});

// Handle language change
document.getElementById("langSelect").addEventListener("change", (event) => {
  applyTranslations(event.target.value);
});

// Toggle between custom and seed modes
function toggleMode() {
  if (document.getElementById("endGameButton").style.display !== "none")
    endGame();
  isCustomMode = !isCustomMode;
  document.body.classList.toggle("custom-mode", isCustomMode);
  const modeToggle = document.getElementById("modeToggle");
  const langData = translations[document.getElementById("langSelect").value];
  modeToggle.textContent = isCustomMode
    ? langData.switchToSeedMode
    : langData.switchToCustomMode;
  document.getElementById("customSelectionUI").style.display = isCustomMode
    ? "block"
    : "none";
  document.querySelector(".input-container").style.display = isCustomMode
    ? "none"
    : "flex";
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

// Populate avatar pool for custom mode
function populateAvatarPool() {
  const pool = document.getElementById("avatarPool");
  pool.innerHTML = "";
  avatars.forEach((avatar) => {
    const img = document.createElement("img");
    img.src = "avatars/" + avatar;
    img.classList.add("avatar-selectable");
    if (selectedAvatars.includes(avatar)) img.classList.add("avatar-selected");
    img.onclick = () => toggleSelection(avatar, img);
    pool.appendChild(img);
  });

  const langData = translations[document.getElementById("langSelect").value];
  document.getElementById(
    "selectionCounter"
  ).textContent = `${langData.selected}${selectedAvatars.length}`;
}

// Toggle selection of an avatar
function toggleSelection(avatar, img) {
  const index = selectedAvatars.indexOf(avatar);
  if (index === -1) {
    selectedAvatars.push(avatar);
    img.classList.add("avatar-selected");
  } else {
    selectedAvatars.splice(index, 1);
    img.classList.remove("avatar-selected");
  }

  const langData = translations[document.getElementById("langSelect").value];
  document.getElementById(
    "selectionCounter"
  ).textContent = `${langData.selected}${selectedAvatars.length}`;
}

// Start game based on mode
function startGame() {
  const langData = translations[document.getElementById("langSelect").value];

  if (isCustomMode) {
    if (selectedAvatars.length < 24) {
      alert(langData.selectAtLeast24Operators);
      return;
    }
    startCustomGame();
  } else {
    if (!document.getElementById("seedInput").value.trim()) {
      alert(langData.enterOrGenerateSeed);
      return;
    }
    startSeedGame();
  }
  document.getElementById("selectAllButton").style.display = "none";
}

// Start custom game
function startCustomGame() {
  const secretIndex = Math.floor(Math.random() * selectedAvatars.length);
  const secretCharacter = selectedAvatars[secretIndex];
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  selectedAvatars.forEach((avatar) => {
    const img = document.createElement("img");
    img.src = "avatars/" + avatar;
    img.classList.add("avatar");
    img.onclick = () => toggleHide(img);
    boardDiv.appendChild(img);
  });
  document.getElementById(
    "secretCharacter"
  ).innerHTML = `<img src="avatars/${secretCharacter}" class="secret-avatar">`;
  document.getElementById("customSelectionUI").style.display = "none";
  document.getElementById("yourBoardText").style.display = "block";
  document.getElementById("yourOperatorText").style.display = "block";
  document.getElementById("startGameButton").style.display = "none";
  document.getElementById("endGameButton").style.display = "inline-block";
}

// Start seed-based game
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
  const langData = translations[document.getElementById("langSelect").value];

  if (avatars.length < 24) {
    alert(langData.avatarListNotLoaded);
    return;
  }
  const selectedAvatars = shuffleWithSeed(avatars, seed).slice(0, 24);
  const secretSeed = seed + performance.now();
  const secretIndex = Math.floor(seededRandom(secretSeed) * 24);
  const secretCharacter = selectedAvatars[secretIndex];
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  selectedAvatars.forEach((avatar) => {
    const img = document.createElement("img");
    img.src = "avatars/" + avatar;
    img.classList.add("avatar");
    img.onclick = () => toggleHide(img);
    boardDiv.appendChild(img);
  });
  document.getElementById(
    "secretCharacter"
  ).innerHTML = `<img src="avatars/${secretCharacter}" class="secret-avatar">`;
  document.getElementById("yourBoardText").style.display = "block";
  document.getElementById("yourOperatorText").style.display = "block";
  document.getElementById("startGameButton").style.display = "none";
  document.getElementById("endGameButton").style.display = "inline-block";
}

// End game and reset UI
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

// Toggle theme between dark and light mode
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

// Seed-based random number generator
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Shuffle array using a seed
function shuffleWithSeed(array, seed) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate a random seed
function generateRandomSeed() {
  const randomSeed = Math.floor(
    100000000 + Math.random() * 900000000
  ).toString();
  document.getElementById("seedInput").value = randomSeed;
}

// Copy seed to clipboard
function copySeed() {
  const seed = document.getElementById("seedInput").value;
  const button = document.querySelector('button[onclick="copySeed()"]');
  const originalText = button.textContent;
  const langData = translations[document.getElementById("langSelect").value];

  if (!seed) {
    alert(langData.noSeedToCopy);
    return;
  }

  navigator.clipboard.writeText(seed).then(() => {
    button.textContent = langData.copied;
    button.style.backgroundColor = "ForestGreen";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 1000);
  });
}

// Generate custom selection code
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

// Apply custom selection code
function applyCustomSelectedCode() {
  const code = document.getElementById("customCodeInput").value.trim();
  const langData = translations[document.getElementById("langSelect").value];

  if (!code) {
    alert(langData.noCustomCodeToCopy);
    return;
  }

  try {
    const indices = atob(code)
      .split(",")
      .map((num) => parseInt(num));
    selectedAvatars = indices.map((index) => avatars[index]).filter(Boolean);
    if (selectedAvatars.length < 24) {
      alert(langData.invalidSelection);
      return;
    }
    populateAvatarPool();
    document.getElementById(
      "selectionCounter"
    ).textContent = `Selected: ${selectedAvatars.length}`;
  } catch (e) {
    alert(langData.invalidCustomCode);
  }
}

// Copy custom code to clipboard
function copyCustomCode() {
  const code = document.getElementById("customCodeInput").value;
  const button = document.querySelector('button[onclick="copyCustomCode()"]');
  const originalText = button.textContent;
  const langData = translations[document.getElementById("langSelect").value];

  if (!code) {
    alert(langData.noCustomCodeToCopy);
    return;
  }

  navigator.clipboard.writeText(code).then(() => {
    button.textContent = langData.copied;
    button.style.backgroundColor = "ForestGreen";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 1000);
  });
}

// Toggle visibility of an avatar
function toggleHide(img) {
  img.classList.toggle("hidden");
}

// Select or deselect all avatars
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
