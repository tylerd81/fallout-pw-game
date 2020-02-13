const path = require("path");
const { app, initApp } = require("./routes/words");
const WordListCreator = require("./word_list_creator/word_list_creator");
const PORT = 8000;

async function init() {
  const wlc = new WordListCreator();
  const wordFile = path.join(__dirname, "routes/wordlist.txt");

  try {
    await wlc.loadWordFile(wordFile);
  } catch (err) {
    console.log(`Error loading word file: ${err}`);
  }
  initApp(wlc);
  app.listen(PORT, () => console.log("Server Started"));
}

app.get("/", (req, res) => {
  res.status(200).send("<h1>Ok!</h1>");
});

init();
