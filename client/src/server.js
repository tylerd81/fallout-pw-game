// loadWords() connects to the server and requests the
// words to use. It returns an array of numWords words all
// with the length of wordLength.

export async function loadWords(numWords = 5, wordLength = 5) {
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
