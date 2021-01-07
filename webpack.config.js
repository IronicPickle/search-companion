const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: false,
  entry: {
    background: path.join(__dirname, "src/scripts/background.ts"),
    urlChecker: path.join(__dirname, "src/scripts/urlChecker.ts"),
    popupPage: path.join(__dirname, "src/react/popup.tsx")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public" }
      ]
    })
  ]
}