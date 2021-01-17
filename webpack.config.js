const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: false,
  entry: {
    "js/background/main": path.join(__dirname, "src/background/main.ts"), // Handles interface script injection

    "js/content/interfaces/cms": path.join(__dirname, "src/content/interfaces/cms.ts"), // CMS interface
    "js/content/interfaces/terra": path.join(__dirname, "src/content/interfaces/terra.ts"), // TerraFirma interface
    "js/content/interfaces/coalAuthority": path.join(__dirname, "src/content/interfaces/coalAuthority.ts"), // Coal Authority interface
    "js/content/interfaces/unitedUtilities": path.join(__dirname, "src/content/interfaces/unitedUtilities.ts"), // United Utilities interface
    "js/content/interfaces/simpleSearch": path.join(__dirname, "src/content/interfaces/simpleSearch.ts"), // Simple Search interface

    "js/react/popup": path.join(__dirname, "src/react/popup.tsx"), // Popup react root
    "js/react/embed": path.join(__dirname, "src/react/embed.tsx") // Embed react root
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
        { from: "main/html/", to: "html/" },
        { from: "main/images/", to: "images/" },
        { from: "main/manifest.json", to: "manifest.json" }
      ]
    })
  ]
}