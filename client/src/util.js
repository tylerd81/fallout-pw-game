export const specialChars = "~!@#$%^&*()[]{}:;'\".<>|\\/-+=";

export function toHex(num) {
  let hex = num.toString(16);
  const minLength = 4;

  while (hex.length < minLength) {
    hex = "0" + hex;
  }
  return "0x" + hex;
}

export function computeLikeness(word1, word2) {
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

// getPasswordWithId() returns the string that is made up of the characters
// with the data-character-id attribute set to id. It then just maps through
// all the elements and gets the innerText value which are the characters
// that make up the password.
export function getPasswordWithId(id) {
  const pwChars = document.querySelectorAll(`[data-character-id = "${id}"]`);
  const pw = Array.from(pwChars).map(char => char.innerText);
  return pw.join("");
}

// createMemoryDump() cretes an array and adds all the garbage characters
// and the words to the array. This array is then used to display the
// "memory dump" for the game containing the garbage characters and
// the possible passwords.
export function createMemoryDump(wordList, numRows, numCols) {
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
