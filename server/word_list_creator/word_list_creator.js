const fs = require("fs");

class WordListCreator {
  constructor() {
    this.wordsLoaded = false;
    this.wordCount = 0;
  }

  loadWordFile(wordFileName) {
    this.wordFileName = wordFileName;

    return new Promise((resolve, reject) => {
      fs.readFile(this.wordFileName, { encoding: "utf-8" }, (err, data) => {
        if (err) {
          reject(`Error reading file: ${this.wordFileName}`);
          return;
        }
        this.wordsLoaded = true;
        this.wordList = data.trim().split("\n");
        this.wordCount = this.wordList.length;
        resolve(true);
      });
    });
  }

  getWordAt(wordNum) {
    if (wordNum < 0 || wordNum >= this.wordCount) {
      return undefined;
    }

    return this.wordList[wordNum];
  }

  getWords(numWords, maxLength = 5) {
    // words should be sorted by their lengths when the list is first loaded
    // then need to choose unique random numbers.

    const words = [];
    for (let i = 0; i < numWords; i++) {
      words.push(this.wordList[i]);
    }

    return words;
  }
}

module.exports = WordListCreator;
