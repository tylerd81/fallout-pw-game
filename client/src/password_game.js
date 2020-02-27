import { setSelectedOutput } from "./ui";
import { getPasswordWithId } from "./util";
export const specialChars = "~!@#$%^&*()[]{}:;'\".<>|\\/-+=";

export function createHandlers() {
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
