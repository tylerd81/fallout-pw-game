/* words.js - all the route handlers for the /words endpoint */

const path = require("path");
const express = require("express");
const app = express();
const WordListCreator = require("../word_list_creator/word_list_creator");
const cors = require("cors");

/* word list used by the server */
let wordListCreator;

/*
 * init() creates the WordListCreator object. It is async
 * because WordListCreator.loadWordFile() is an async operation
 * and if the server starts up before the word file is read it
 * will cause errors so we have to wait for it.
 */
(async function init() {
  wordListCreator = new WordListCreator();
  const wordListFileName = "../data/bigwordlist.txt";
  const wordFile = path.join(__dirname, wordListFileName);

  try {
    console.log(`Loading ${wordFile}...`);
    await wordListCreator.loadWordFile(wordFile);
    console.log(`Word file ${wordFile} loaded.`);
  } catch (err) {
    console.log(`Error loading word file: ${err}`);
  }
})();

app.use(cors());

app.get("/words", (req, res) => {
  const defaultWordCount = 5;
  const defaultWordLength = 5;
  const maxWords = 20;

  const maxLength = Number.parseInt(req.query.length) || defaultWordLength;

  // if random garbage is passed in the query, set count to the default
  let wordCount = Number.parseInt(req.query.count) || defaultWordCount;
  if (wordCount < 0 || wordCount > maxWords) {
    wordCount = defaultWordCount;
  }

  const wordList = getWordList(wordCount, maxLength);

  const data = {
    count: wordCount,
    words: wordList
  };

  res.status(200).json(data);
});

function getWordList(wordCount, maxLength = 5) {
  const words = wordListCreator.getWords(wordCount, maxLength);
  return words;
}
module.exports = app;
