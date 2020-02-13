const SimpleRandomNumberGenerator = require("../word_list_creator/simple_number_generator");

describe("Test the Random number generator", () => {
  test("It should create some random numbers...", () => {
    const maxVal = 50;
    const srng = new SimpleRandomNumberGenerator(maxVal);

    for (let i = 0; i < 5; i++) {
      let n = srng.nextInt();
      expect(n > 0 && n < maxVal).toBeTruthy();
    }
  });

  test("Two nextInt() in a row shouldn't return same number", () => {
    const maxVal = 50;
    const srng = new SimpleRandomNumberGenerator(maxVal);

    const a = srng.nextInt();
    const b = srng.nextInt();

    expect(a !== b).toBeTruthy();
  });
});
