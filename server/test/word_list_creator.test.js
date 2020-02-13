/*
 * Tests for the WordListCreator Class
 * These tests don't connect to the server or anything, they just test the
 * WordListCreator class.
 */

const WordListCreator = require("../word_list_creator/word_list_creator");
const path = require("path");

describe("WordListCreator Class", () => {
  let wordListCreator;

  beforeAll(async () => {
    wordListCreator = new WordListCreator();
    const testWordFileName = path.join(__dirname, "test_word_list.txt");
    await wordListCreator.loadWordFile(testWordFileName);
  });

  test("WordListCreator() should exist", () => {
    expect(WordListCreator).toBeDefined();
  });

  test("WordListCreator should load the test word file and wordsLoaded should be true", async done => {
    expect(wordListCreator.wordsLoaded).toBeTruthy();
    done();
  });

  test("the test word list should contain 30 words", async done => {
    expect(wordListCreator.wordCount).toEqual(30);
    done();
  });

  test("the first word should be 'compute' and the last word should be 'poison'", async done => {
    expect(wordListCreator.getWordAt(0)).toEqual("compute");
    expect(wordListCreator.getWordAt(29)).toEqual("poison");
    done();
  });

  test("getWords(5) should return 5 words", async done => {
    const words = wordListCreator.getWords(5);
    expect(words.length).toEqual(5);
    done();
  });

  test("getWords(3,7) should return 3 words, each with a length of 7 characters", async done => {
    const words = wordListCreator.getWords(3, 7);
    expect(words.length).toEqual(3);
    words.forEach(word => expect(word.length).toEqual(7));

    done();
  });
});
