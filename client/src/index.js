import { createHandlers } from "./password_game";
import { computeLikeness, createMemoryDump, getPasswordWithId } from "./util";
import { loadWords } from "./server";
import {
  setSelectedOutput,
  showMemoryAddresses,
  createDebugDataDisplay,
  showAttemptsLeft,
  setStatusMessage,
  showAccessDenied,
  showAccessGranted
} from "./ui";

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
