import {
  createDebugDataDisplay,
  createHandlers,
  getPasswordWithId,
  setSelectedOutput,
  specialChars,
  setStatusMessage
} from "./password_game";

function toHex(num) {
  let hex = num.toString(16);
  const minLength = 4;

  while (hex.length < minLength) {
    hex = "0" + hex;
  }
  return "0x" + hex;
}

function computeLikeness(word1, word2) {
  let likeness = 0;
  if (word1.length !== word2.length) {
    return 0;
  }

  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === word2[i]) {
      likeness++;
    }
  }
  return likeness;
}
function showAccessGranted() {
  document.getElementById("access-granted").style.display = "block";
}

function showAccessDenied() {
  document.getElementById("access-denied").style.display = "block";
}

function showAttemptsLeft(num) {
  const attemptChar = "*";
  const ac = document.getElementById("attempt-container");
  ac.innerText = "";

  for (let i = 0; i < num; i++) {
    ac.innerText = ac.innerText + attemptChar;
  }
}
function showMemoryAddresses(parentElement, startingNum, stepAmt, numRows) {
  const ul = document.createElement("ul");
  let currNum = startingNum;
  for (let i = 0; i < numRows; i++) {
    const li = document.createElement("li");
    li.innerText = toHex(currNum);
    currNum += stepAmt;
    ul.appendChild(li);
  }
  parentElement.appendChild(ul);
}

function createMemoryDump(wordList, numRows, numCols) {
  const wordLength = wordList.reduce((total, word) => total + word.length, 0);
  if (wordLength > numRows * numCols) {
    throw "There are more words than would fit into the number of rows x cols";
  }

  const mem = [];

  // fill all the elements with garbage characters
  for (let i = 0; i < numRows * numCols; i++) {
    mem.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
  }

  const gap = 2; // at least this many garbage characters before each password

  // randomly place the words
  wordList.forEach(word => {
    let placed = false;

    while (!placed) {
      let start = Math.floor(Math.random() * numRows * numCols);

      // check before this position so password doesn't start right after another
      if (start !== gap) {
        if (!specialChars.includes(mem[start - 1])) {
          continue; // there is a password right before this spot
        }
      }

      let freeSpots = 0;
      for (let i = 0; i < word.length + gap && start + i < mem.length; i++) {
        if (!specialChars.includes(mem[start + i])) {
          break; // password is already here
        } else {
          freeSpots++;
        }
      }
      if (freeSpots === word.length + gap) {
        mem.splice(start, word.length, ...word.toUpperCase().split(""));
        placed = true;
      }
    }
  });
  return mem.join("");
}

async function loadWords(numWords = 5, wordLength = 5) {
  // use fetch to load the acual words from the api here
  // return Promise.resolve(["dog", "cat", "bat", "rat", "hat"]);
  try {
    const apiUrl = `http://localhost:8000/words?count=${numWords}&length=${wordLength}`;

    const response = await fetch(apiUrl);
    const jsonWords = await response.json();
    return jsonWords.words;
  } catch (e) {
    throw e;
  }
}

async function init() {
  const numRows = 16;
  const numCols = 12;
  const numWords = 18; // should be multiple of 2
  const wordLength = 8;

  let correctPassword;
  let words;

  // load the words from the API
  try {
    words = await loadWords(numWords, wordLength);
  } catch (e) {
    setSelectedOutput(e.message);
    return;
  }

  // setup memory displays next to memory dumps
  const memoryDisplay1 = document.getElementById("mem-display-1");
  const memoryDisplay2 = document.getElementById("mem-display-2");

  showMemoryAddresses(memoryDisplay1, 0, numCols, numRows);
  showMemoryAddresses(memoryDisplay2, numRows * 12, numCols, numRows);

  // cut the words array in half
  const wordsArea1 = words.slice(0, Math.floor(numWords / 2));
  const wordsArea2 = words.slice(Math.floor(numWords / 2));

  // choose a random correct password
  correctPassword = words[Math.floor(Math.random() * words.length)];
  console.log(correctPassword);

  // display first memory dump
  const mainContainer = document.getElementById("debug-area-1");
  const mem1 = createMemoryDump(wordsArea1, numRows, numCols);
  createDebugDataDisplay(mainContainer, numRows, numCols, mem1);

  // display second memory dump
  const secondContainer = document.getElementById("debug-area-2");
  const mem2 = createMemoryDump(wordsArea2, numRows, numCols);
  createDebugDataDisplay(secondContainer, numRows, numCols, mem2);

  // createHandlers() must be called after all the DOM elements are created
  createHandlers();

  let attempts = 4;
  let gameOver = false;

  showAttemptsLeft(attempts);

  //Click handler for when a password is clicked.
  document.querySelectorAll(".password-character").forEach(pc =>
    pc.addEventListener("click", () => {
      if (gameOver) {
        return;
      }

      const guess = getPasswordWithId(pc.dataset.characterId);

      if (guess.toLowerCase() === correctPassword) {
        setStatusMessage("PASSWORD ACCEPTED");
        gameOver = true;
        showAccessGranted();
      } else {
        const likeness = computeLikeness(guess.toLowerCase(), correctPassword);
        setStatusMessage(`INVALID PASSWORD ${guess}: Likeness=${likeness}`);
        attempts--;
        if (attempts === 0) {
          showAccessDenied();
          gameOver = true;
        }
        showAttemptsLeft(attempts);
      }
    })
  );

  // set the output to blank when the mouse is moved out of the debug area
  document.querySelectorAll(".debug-data").forEach(dd => {
    dd.addEventListener("mouseout", () => setSelectedOutput(""));
  });
}

init();
