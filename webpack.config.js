const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: false,
  entry: {
    "js/background/main": path.join(__dirname, "src/background/main.ts"), // Handles interface script injection

    "js/content/interfaces/CMS": path.join(__dirname, "src/content/interfaces/CMS.ts"), // CMS interface
    "js/content/interfaces/KanBan": path.join(__dirname, "src/content/interfaces/KanBan.ts"), // KanBan interface

    "js/content/interfaces/Terra": path.join(__dirname, "src/content/interfaces/Terra.ts"), // TerraFirma interface
    "js/content/interfaces/CoalAuthority": path.join(__dirname, "src/content/interfaces/CoalAuthority.ts"), // Coal Authority interface
    "js/content/interfaces/UnitedUtilities": path.join(__dirname, "src/content/interfaces/UnitedUtilities.ts"), // United Utilities interface
    "js/content/interfaces/UtilitySearch": path.join(__dirname, "src/content/interfaces/UtilitySearch.ts"), // Utility Search interface
    
    "js/content/interfaces/SimpleSearch": path.join(__dirname, "src/content/interfaces/SimpleSearch.ts"), // Simple Search interface
    "js/content/interfaces/Fensa": path.join(__dirname, "src/content/interfaces/Fensa.ts"), // Fensa interface
    "js/content/interfaces/Tameside": path.join(__dirname, "src/content/interfaces/Tameside.ts"), // Tameside interface
    "js/content/interfaces/Warrington": path.join(__dirname, "src/content/interfaces/Warrington.ts"), // Warrington interface
    "js/content/interfaces/Blackburn": path.join(__dirname, "src/content/interfaces/Blackburn.ts"), // Warrington interface
    "js/content/interfaces/RibbleValley": path.join(__dirname, "src/content/interfaces/RibbleValley.ts"), // Ribble Valley interface
    "js/content/interfaces/Preston": path.join(__dirname, "src/content/interfaces/Preston.ts"), // Preston interface
    "js/content/interfaces/CheshireEast": path.join(__dirname, "src/content/interfaces/cheshireEast.ts"), // Cheshire East interface
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