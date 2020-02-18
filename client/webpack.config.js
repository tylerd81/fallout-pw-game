const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/js"),
    publicPath: "/dist/js"
  },
  devServer: {
    contentBase: "./dist",
    inline: true,
    hot: true
  }
};
