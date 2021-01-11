const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: false,
  entry: {
    "js/background/main": path.join(__dirname, "src/background/main.ts"),

    "js/content/main": path.join(__dirname, "src/content/main.ts"),
    "js/content/interfaces/cms": path.join(__dirname, "src/content/interfaces/cms.ts"),
    "js/content/interfaces/terra": path.join(__dirname, "src/content/interfaces/terra.ts"),
    "js/content/interfaces/stockport": path.join(__dirname, "src/content/interfaces/stockport.ts"),

    "js/react/popup": path.join(__dirname, "src/react/popup.tsx"),
    "js/react/embed": path.join(__dirname, "src/react/embed.tsx")
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
    path: path.resolve(__dirname,  "build/")
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/images", to: "images/" },
        { from: "src/html", to: "html/" },
        { from: "src/manifest.json", to: "./"}
      ]
    })
  ]
}