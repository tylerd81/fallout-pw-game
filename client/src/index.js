const passwordCharacters = document.querySelectorAll(".password-character");

// when a password character is moused over, highlight all the other
// password characters that have the same data-character-id attribute
// value.
passwordCharacters.forEach(pc => {
  pc.addEventListener("mouseover", () => {
    const id = pc.dataset.characterId;

    if (!pc.classList.contains("password-character-highlight")) {
      pc.classList.add("password-character-highlight");

      // find all the other items with the same dataset.characterId
      const otherChars = document.querySelectorAll(
        `[data-character-id = "${id}"]`
      );
      otherChars.forEach(otherPc => {
        if (
          otherPc.dataset.characterId === id &&
          !otherPc.classList.contains("password-character-highlight")
        ) {
          otherPc.classList.add("password-character-highlight");
        }
      });
    }

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

function getPasswordWithId(id) {
  const pwChars = document.querySelectorAll(`[data-character-id = "${id}"]`);
  const pw = Array.from(pwChars).map(char => char.innerText);
  return pw.join("");
}

function setSelectedOutput(word) {
  document.querySelector("#current-output").innerText = word;
}
