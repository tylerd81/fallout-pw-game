const express = require("express");
const app = express();

let wordListCreator;

// initApp() is called to pass in the WordListCreator object that will be used
function initApp(wlc) {
  wordListCreator = wlc;
}

app.get("/words", (req, res) => {
  const defaultWordCount = 5;
  const maxLength = 5;
  const wordCount = req.query.count || defaultWordCount;
  const wordList = getWordList(wordCount, maxLength);

  const data = {
    count: wordCount,
    words: wordList,
    answer: 0
  };

  res.status(200).json(data);
});

function getWordList(wordCount, maxLength = 5) {
  const words = wordListCreator.getWords(wordCount);
  return words;
}
module.exports = { app, initApp };
