function createHandlers() {
  const passwordCharacters = document.querySelectorAll(".password-character");

  // each character that makes up a possible password will have the class
  // "password-character". The possible password will also have a data
  // attribute called "data-character-id" set. Each character that makes
  // up a single password will all have the same id set.

  // All other characters (the random garbage characters) will have the
  // class "debug-character".

  // when a password character is moused over, highlight all the other
  // password characters that have the same data-character-id attribute
  // value.

  // set the mouse over handler for each element with the class of
  // "password-character"
  passwordCharacters.forEach(pc => {
    pc.addEventListener("mouseover", () => {
      const id = pc.dataset.characterId;

      if (!pc.classList.contains("password-character-highlight")) {
        pc.classList.add("password-character-highlight");

        // find all the other items with the same dataset.characterId and
        // set them to be highlighted
        const otherChars = document.querySelectorAll(
          `[data-character-id = "${id}"]`
        );
        otherChars.forEach(otherPc => {
          if (!otherPc.classList.contains("password-character-highlight")) {
            otherPc.classList.add("password-character-highlight");
          }
        });
      }

      // also set the output to display the password
      setSelectedOutput(getPasswordWithId(id));
    });

    // remove the password-character-highlight class from the elements
    // that have the same data-character-id value when the mouse moves
    // off of them.
    pc.addEventListener("mouseout", () => {
      if (pc.classList.contains("password-character-highlight")) {
        pc.classList.remove("password-character-highlight");

        const id = pc.dataset.characterId;
        const otherChars = document.querySelectorAll(
          `[data-character-id = "${id}"]`
        );
        otherChars.forEach(otherPc => {
          if (otherPc.classList.contains("password-character-highlight")) {
            otherPc.classList.remove("password-character-highlight");
          }
        });
      }
    });
  });

  // set the output to show the highlighted regular characters when
  // they are moused over.
  document.querySelectorAll(".debug-character").forEach(ch => {
    ch.addEventListener("mouseover", () => setSelectedOutput(ch.innerText));
  });
}

// getPasswordWithId() returns the string that is made up of the characters
// with the data-character-id attribute set to id
function getPasswordWithId(id) {
  const pwChars = document.querySelectorAll(`[data-character-id = "${id}"]`);
  const pw = Array.from(pwChars).map(char => char.innerText); // Array.from() might not be needed
  return pw.join("");
}

function setSelectedOutput(word) {
  document.querySelector("#current-output").innerText = word;
}

function addPasswordCharacter(
  parent,
  ch,
  id,
  className = "password-character"
) {
  const el = document.createElement("span");
  el.classList.add(className);
  el.innerText = ch;
  el.dataset.characterId = id;
  parent.appendChild(el);
}

function addGarbageCharacter(parent, ch, className = "debug-character") {
  const el = document.createElement("span");
  el.classList.add(className);
  el.innerText = ch;
  parent.appendChild(el);
}

function createRow() {
  const row = document.createElement("div");
  row.classList.add("debug-data-row");
  console.log(row);
  return row;
}

let passwordId = 0;

function createDebugDataDisplay(rootContainer, numRows, numCols, memoryData) {
  const specialChars = "~!@#$%^&*()[]{}:;'\".<>|\\/-+=";

  if (numRows * numCols > memoryData.split("").length) {
    throw `Memory size too small: ${numRows * numCols} > ${memoryData.length}`;
  }
  let currChar = 0;
  let inPassword = false;

  for (let row = 0; row < numRows; row++) {
    const rowElement = createRow();

    for (let i = 0; i < numCols; i++) {
      const ch = memoryData[currChar];
      if (specialChars.includes(ch)) {
        if (inPassword) {
          inPassword = false;
          passwordId++;
        }
        addGarbageCharacter(rowElement, ch);
      } else {
        if (!inPassword) {
          inPassword = true;
        }
        addPasswordCharacter(rowElement, ch, passwordId);
      }
      currChar++;
    }
    rootContainer.appendChild(rowElement);
  }
}

function init() {
  const mainContainer = document.getElementById("debug-area-1");
  const mem = "SARGE%$^!CAT&*(GREEN^%*&%";
  createDebugDataDisplay(mainContainer, 5, 5, mem);

  const secondContainer = document.getElementById("debug-area-2");
  createDebugDataDisplay(secondContainer, 5, 5, mem);
  // set the handler for when a password item is clicked

  // createHandlers() must be called after all the DOM elements are created
  createHandlers();
  // set the output to blank when the mouse is moved out of the debug area
  document.querySelectorAll(".debug-data").forEach(dd => {
    dd.addEventListener("mouseout", () => setSelectedOutput(""));
  });
}

init();
