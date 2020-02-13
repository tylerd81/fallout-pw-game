/*
 * Tests for the /words endpoint.
 */

const request = require("supertest");
const wordApp = require("../routes/words");

describe("The /words endpoint", () => {
  test("/words should return a json object", async done => {
    await request(wordApp)
      .get("/words")
      .expect("Content-Type", /json/);

    done();
  });
  test("/words should return a json object with a words property: {words: []}", async done => {
    const res = await request(wordApp).get("/words");
    const jsonObject = JSON.parse(res.res.text);
    expect(jsonObject).toHaveProperty("words");
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

  test("/words?count=5&length=5 should return 5 words of length 5", async done => {
    const res = await request(wordApp).get("/words?count=5&length=5");
    const jsonObject = JSON.parse(res.res.text);
    expect(jsonObject).toHaveProperty("count", 5);
    expect(jsonObject).toHaveProperty("words");

    const { words } = jsonObject;

    words.forEach(word => expect(word.length).toEqual(5));
    done();
  });

  test("Passing random string as count (/words?count=abc) should default to a count of 5", async done => {
    const res = await request(wordApp).get("/words?count=abc");
    const jsonObject = JSON.parse(res.res.text);
    expect(jsonObject).toHaveProperty("count", 5);
    done();
  });
});
