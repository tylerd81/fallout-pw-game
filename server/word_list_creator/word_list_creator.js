const fs = require("fs");
const SimpleRandomNumberGenerator = require("./simple_number_generator");

class WordListCreator {
  constructor() {
    this.wordsLoaded = false;
    this.wordCount = 0;
    this.sortedWords = new Map();
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
        this._sortByLength();
        resolve(true);
      });
    });
  }

  _sortByLength() {
    // store the index of each word sorted by length
    // when you want a word of a certain length get the index of
    // each word from the sortedWords object

    // this.sortedWords is an actual Map, not just an Object so
    // use get(), set(), etc. rather than accessing it like a
    // regular object.
    this.sortedWords = new Map();

    this.wordList.forEach((word, wordIdx) => {
      let length = word.length;
      if (!this.sortedWords.has(length)) {
        this.sortedWords.set(length, []);
      }
      this.sortedWords.get(length).push(wordIdx);
    });
  }

  getWordAt(wordNum) {
    if (wordNum < 0 || wordNum >= this.wordCount) {
      return undefined;
    }
    return this.wordList[wordNum];
  }

  getWords(numWords, wordLength = 5) {
    // words should be sorted by their lengths when the list is first loaded
    // then need to choose unique random numbers.
    const maxWordLength = 10;
    const minWordLength = 4;

    if (wordLength < minWordLength || wordLength > maxWordLength) {
      wordLength = 5;
    }

    if (!this.sortedWords.has(wordLength)) {
      // what if there are no words of this length?
      return [];
    }

    const sortedWordIndices = this.sortedWords.get(wordLength);
    const numberGenerator = new SimpleRandomNumberGenerator(
      sortedWordIndices.length
    );

    // if more words are requested than are in the list
    if (numWords > sortedWordIndices.length) {
      numWords = sortedWordIndices.length;
    }

    const words = [];
    for (let i = 0; i < numWords; i++) {
      const wordIdx = sortedWordIndices[numberGenerator.nextInt()];
      words.push(this.wordList[wordIdx]);
    }

    return words;
  }
}

module.exports = WordListCreator;
