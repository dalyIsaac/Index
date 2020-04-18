const path = require("path");
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

function srcPaths(src) {
  return path.join(__dirname, src);
}

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
  mode: "development",
  target: "electron-renderer",
  devtool: "source-map",
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    alias: {
      "@main": srcPaths("src/main"),
      "@models": srcPaths("src/models"),
      "@renderer": srcPaths("src/renderer"),
    },
    extensions: [".js", ".ts", ".tsx", ".jsx", ".json"],
  },
};
