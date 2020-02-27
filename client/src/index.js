import { createHandlers } from "./password_game";
import {
  computeLikeness,
  createMemoryDump,
  getPasswordWithId,
  removeAllElements
} from "./util";
import { loadWords } from "./server";
import {
  setSelectedOutput,
  showMemoryAddresses,
  createDebugDataDisplay,
  showAttemptsLeft,
  setStatusMessage,
  showAccessDenied,
  showAccessGranted,
  hideAccessDenied,
  hideAccessGranted
} from "./ui";

const gameSettings = {
  numRows: 16,
  numCols: 12,
  numWords: 18,
  wordLength: 8,
  wordList: [],
  correctPassword: "",
  attempts: 4,
  gameOver: false
};

function dumpGameSettings() {
  console.log(gameSettings);
}

function loadUi() {
  const { numWords, wordList, numRows, numCols } = gameSettings;
  if (wordList.length === 0) {
    throw "Word list is 0, word list must be loaded first.";
  }

  // setup memory displays next to memory dumps

  const memoryDisplay1 = document.getElementById("mem-display-1");
  const memoryDisplay2 = document.getElementById("mem-display-2");
  console.log(memoryDisplay1.firstChild);
  console.assert(memoryDisplay1.firstChild === null);
  console.assert(memoryDisplay2.firstChild === null);

  showMemoryAddresses(memoryDisplay1, 0, numCols, numRows);
  showMemoryAddresses(memoryDisplay2, numRows * 12, numCols, numRows);

  // cut the words array in half
  const wordsArea1 = wordList.slice(0, Math.floor(numWords / 2));
  const wordsArea2 = wordList.slice(Math.floor(numWords / 2));

  // display the "memory dumps"
  const mem1 = createMemoryDump(wordsArea1, numRows, numCols);
  const mem2 = createMemoryDump(wordsArea2, numRows, numCols);

  // get the containers and display the dumps
  const mainContainer = document.getElementById("debug-area-1");
  const secondContainer = document.getElementById("debug-area-2");

  createDebugDataDisplay(mainContainer, numRows, numCols, mem1);
  createDebugDataDisplay(secondContainer, numRows, numCols, mem2);
}

function passwordChecker(passwordChar) {
  console.log("pw checker");
  const pc = passwordChar;
  if (gameSettings.gameOver) {
    return;
  }

  const guess = getPasswordWithId(pc.dataset.characterId);

  if (guess.toLowerCase() === gameSettings.correctPassword) {
    setStatusMessage("PASSWORD ACCEPTED");
    gameSettings.gameOver = true;
    showAccessGranted();
    setTimeout(() => {
      hideAccessGranted();
      resetGame();
    }, 4000);
  } else {
    const likeness = computeLikeness(
      guess.toLowerCase(),
      gameSettings.correctPassword
    );
    setStatusMessage(`INVALID PASSWORD ${guess}: Likeness=${likeness}`);
    gameSettings.attempts--;
    if (gameSettings.attempts === 0) {
      showAccessDenied();
      gameSettings.gameOver = true;
    }
    showAttemptsLeft(gameSettings.attempts);
  }
}

async function startGame() {
  console.log("Start");
  const { numWords, wordLength } = gameSettings;

  // load the words from the API
  try {
    gameSettings.wordList = await loadWords(numWords, wordLength);
  } catch (e) {
    setSelectedOutput(e.message);
    return;
  }

  // choose a random correct password
  const { wordList } = gameSettings;
  gameSettings.correctPassword =
    wordList[Math.floor(Math.random() * wordList.length)];

  loadUi();
  dumpGameSettings();

  showAttemptsLeft(gameSettings.attempts);

  // createHandlers() must be called after all the DOM elements
  // are created by loadUi()
  createHandlers(passwordChecker);
}

// set handler for when reset button is clicked. Have to make sure this is
// only set once else multiple handlers will be set and reset will be called
// multiple times.

document.querySelector("#reset-button").addEventListener("click", () => {
  resetGame();
});

function resetGame() {
  const memDisplay1 = document.querySelector("#mem-display-1");
  const memDisplay2 = document.querySelector("#mem-display-2");
  const debugDisplay1 = document.querySelector("#debug-area-1");
  const debugDisplay2 = document.querySelector("#debug-area-2");
  hideAccessDenied();
  hideAccessGranted();

  removeAllElements(memDisplay1);
  removeAllElements(memDisplay2);
  removeAllElements(debugDisplay1);
  removeAllElements(debugDisplay2);

  gameSettings.gameOver = false;
  gameSettings.wordList = [];
  gameSettings.attempts = 4;

  setSelectedOutput("");
  setStatusMessage("");
  showAttemptsLeft(gameSettings.attempts);

  startGame();
}
startGame();
