const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: false,
  entry: {
    background_main: path.join(__dirname, "src/scripts/background/main.ts"),

    content_main: path.join(__dirname, "src/scripts/content/main.ts"),
    content_cmsHandler: path.join(__dirname, "src/scripts/content/cmsHandler.ts"),

    react_popup: path.join(__dirname, "src/react/popup.tsx"),
    react_embed: path.join(__dirname, "src/react/embed.tsx")
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