import { toHex, specialChars } from "./util";

export function setSelectedOutput(word) {
  document.querySelector("#current-output").innerText = word;
}

export function setStatusMessage(word) {
  document.querySelector("#status-message").innerText = word;
}

export function showAccessGranted() {
  document.getElementById("access-granted").style.display = "block";
}

export function showAccessDenied() {
  document.getElementById("access-denied").style.display = "block";
}

export function showAttemptsLeft(num) {
  const attemptChar = "*";
  const ac = document.getElementById("attempt-container");
  ac.innerText = "";

  for (let i = 0; i < num; i++) {
    ac.innerText = ac.innerText + attemptChar;
  }
}

// showMemoryAddresses() creates a list of hexadecimal numbers that is supposed
// to look like memory addresses. It attaches the created ul element to the
// provided parentElement.

export function showMemoryAddresses(
  parentElement,
  startingNum,
  stepAmt,
  numRows
) {
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
  return row;
}

// passwordId is global because it is possible to call createDebugDataDisplay()
// multiple times and passwordId needs to retain its value after each call so
// that the dataset.chararacterId is set correctly for matching passwords.
let passwordId = 0;

export function createDebugDataDisplay(
  rootContainer,
  numRows,
  numCols,
  memoryData
) {
  if (numRows * numCols > memoryData.split("").length) {
    throw `Memory size too small: ${numRows * numCols} > ${memoryData.length}`;
  }
  let currChar = 0;
  let inPassword = false; // keep track of when we are inserting password characters

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
