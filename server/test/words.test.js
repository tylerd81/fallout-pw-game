const request = require("supertest");
const { app: wordApp, initApp } = require("../routes/words");
const path = require("path");
const WordListCreator = require("../word_list_creator/word_list_creator");
let wlc;

describe("The /words endpoint", () => {
  beforeAll(async done => {
    const fileName = path.join(__dirname, "test_word_list.txt");
    wlc = new WordListCreator();
    await wlc.loadWordFile(fileName);
    initApp(wlc);
    done();
  });

  test("/words should return a json object with a words property: {words: []}", async done => {
    const res = await request(wordApp).get("/words");
    const jsonObject = JSON.parse(res.res.text);
    expect(jsonObject).toHaveProperty("words");
    done();
  });

  test("/words should return a json object", async done => {
    await request(wordApp)
      .get("/words")
      .expect("Content-Type", /json/);

    done();
  });

  test("/words should return a json object with property count set to the default of 5", async done => {
    const res = await request(wordApp).get("/words");
    const jsonObject = JSON.parse(res.res.text);
    expect(jsonObject).toHaveProperty("count", 5);
    done();
  });

  test("/words?count=5 should return 5 words", async done => {
    const res = await request(wordApp).get("/words?count=5");
    const { words } = JSON.parse(res.res.text);

    expect(words.length).toEqual(5);
    done();
  });

  test("/words?count=X should return X number of words (random number)", async done => {
    let wordCount = Math.ceil(Math.random() * 10);
    const res = await request(wordApp).get(`/words?count=${wordCount}`);
    const { words } = JSON.parse(res.res.text);
    expect(words.length).toEqual(wordCount);
    done();
  });
});
