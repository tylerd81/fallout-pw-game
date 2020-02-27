import { setSelectedOutput } from "./ui";
import { getPasswordWithId } from "./util";
export const specialChars = "~!@#$%^&*()[]{}:;'\".<>|\\/-+=";

// each character that makes up a possible password will have the class
// "password-character". The possible password will also have a data
// attribute called "data-character-id" set. Each character that makes
// up a single password will all have the same id set.

// All other characters (the random garbage characters) will have the
// class "debug-character".

// when a password character is moused over, highlight all the other
// password characters that have the same data-character-id attribute
// value.

function passwordCharMouseOverHandler(e) {
  const id = this.dataset.characterId;

  if (!this.classList.contains("password-character-highlight")) {
    this.classList.add("password-character-highlight");

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
}

// remove the password-character-highlight class from the elements
// that have the same data-character-id value when the mouse moves
// off of them.
function passwordCharMouseOutHandler() {
  if (this.classList.contains("password-character-highlight")) {
    // remove highlight from this element
    this.classList.remove("password-character-highlight");

    // find all the other elements with the same character-id and
    // remove the highlights.
    const id = this.dataset.characterId;
    const otherChars = document.querySelectorAll(
      `[data-character-id = "${id}"]`
    );
    otherChars.forEach(otherPc => {
      if (otherPc.classList.contains("password-character-highlight")) {
        otherPc.classList.remove("password-character-highlight");
      }
    });
  }
}

export function createHandlers(passwordChecker) {
  const passwordCharacters = document.querySelectorAll(".password-character");

  // set the mouseover and mouseout handlers for each element with the class of
  // "password-character"
  passwordCharacters.forEach(pc => {
    pc.addEventListener("mouseover", passwordCharMouseOverHandler);
    pc.addEventListener("mouseout", passwordCharMouseOutHandler);
  });

  // set the output to show the highlighted regular characters when
  // they are moused over.
  document.querySelectorAll(".debug-character").forEach(ch => {
    ch.addEventListener("mouseover", () => setSelectedOutput(ch.innerText));
  });

  //Click handler for when a password is clicked.
  document
    .querySelectorAll(".password-character")
    .forEach(pc => pc.addEventListener("click", () => passwordChecker(pc)));

  // set the output to blank when the mouse is moved out of the debug area
  document.querySelectorAll(".debug-data").forEach(dd => {
    dd.addEventListener("mouseout", () => setSelectedOutput(""));
  });
}
