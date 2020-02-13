const path = require("path");
const WordListCreator = require("../word_list_creator/word_list_creator");

let wlc;

(async function init() {
  wlc = new WordListCreator();
  const wordFileName = path.join(__dirname, "wordlist.txt");
  await wlc.loadWordFile(wordFileName);
  console.log(`Loaded ${wlc.wordCount} words`);
})();

module.exports = wlc;
