const WordListCreator = require("../word_list_creator/word_list_creator");
const path = require("path");

describe("WordListCreator Class", () => {
  let wordListCreator;

  beforeEach(() => (wordListCreator = new WordListCreator()));

  test("WordListCreator() should exist", () => {
    expect(WordListCreator).toBeDefined();
  });

  test("WordListCreator should load the test word file and wordsLoaded should be true", async done => {
    const testWordFileName = path.join(__dirname, "test_word_list.txt");
    await wordListCreator.loadWordFile(testWordFileName);
    expect(wordListCreator.wordsLoaded).toBeTruthy();
    done();
  });

  test("the test word list should contain 30 words", async done => {
    const testWordFileName = path.join(__dirname, "test_word_list.txt");
    await wordListCreator.loadWordFile(testWordFileName);
    expect(wordListCreator.wordCount).toEqual(30);
    done();
  });

  test("the first word should be 'compute' and the last word should be 'poison'", async done => {
    const testWordFileName = path.join(__dirname, "test_word_list.txt");
    await wordListCreator.loadWordFile(testWordFileName);
    expect(wordListCreator.getWordAt(0)).toEqual("compute");
    expect(wordListCreator.getWordAt(29)).toEqual("poison");
    done();
  });

  test("getWords(5) should return 5 words", async done => {
    const testWordFileName = path.join(__dirname, "test_word_list.txt");
    await wordListCreator.loadWordFile(testWordFileName);

    const words = wordListCreator.getWords(5);
    expect(words.length).toEqual(5);
    done();
  });
});
