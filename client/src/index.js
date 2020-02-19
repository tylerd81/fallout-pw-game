import {
  createDebugDataDisplay,
  createHandlers,
  getPasswordWithId,
  setSelectedOutput,
  specialChars
} from "./password_game";

function createMemoryDump(wordList, numRows, numCols) {
  const wordLength = wordList.reduce((total, word) => total + word.length, 0);
  if (wordLength > numRows * numCols) {
    throw "There are more words than would fit into the number of rows x cols";
  }

  const mem = [];

  for (let i = 0; i < numRows * numCols; i++) {
    mem.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
  }

  // randomly place the words
  wordList.forEach(word => {
    let placed = false;

    while (!placed) {
      let start = Math.floor(Math.random() * numRows * numCols);
      let freeSpots = 0;
      for (let i = 0; i < word.length && start + i < mem.length; i++) {
        if (!specialChars.includes(mem[start + i])) {
          break; // password is already here
        } else {
          freeSpots++;
        }
      }
      if (freeSpots === word.length) {
        mem.splice(start, word.length, ...word.toUpperCase().split(""));
        placed = true;
      }
    }
  });
  return mem.join("");
}

async function loadWords() {
  // use fetch to load the acual words from the api here
  // return Promise.resolve(["dog", "cat", "bat", "rat", "hat"]);
  const apiUrl = "http://localhost:8000/words";

  const response = await fetch(apiUrl);
  const jsonWords = await response.json();
  console.log(jsonWords);
  return ["dog", "cat", "bat", "rat", "hat"];
}

async function init() {
  const numRows = 20;
  const numCols = 20;
  const words = await loadWords();
  const mainContainer = document.getElementById("debug-area-1");
  // const mem = "SARGE%$^!CAT&*(GREEN^%*&%";
  const mem = createMemoryDump(words, numRows, numCols);
  createDebugDataDisplay(mainContainer, numRows, numCols, mem);

  // const secondContainer = document.getElementById("debug-area-2");
  // createDebugDataDisplay(secondContainer, 5, 5, mem);

  // createHandlers() must be called after all the DOM elements are created
  createHandlers();

  //Click handler for when a password is clicked.
  document
    .querySelectorAll(".password-character")
    .forEach(pc =>
      pc.addEventListener("click", () =>
        console.log(getPasswordWithId(pc.dataset.characterId))
      )
    );

  // set the output to blank when the mouse is moved out of the debug area
  document.querySelectorAll(".debug-data").forEach(dd => {
    dd.addEventListener("mouseout", () => setSelectedOutput(""));
  });
}

init();
