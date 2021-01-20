const { environment } = require("@rails/webpacker");
const typescript =  require('./loaders/typescript')
const path = require("path");

const lessLoader = {
  test: /\.less$/,
  use: [
    {
      loader: "style-loader",
    },
    {
      loader: "css-loader",
    },
    {
      loader: "less-loader",
      options: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  ],
};

environment.loaders.append("less", lessLoader);

environment.config.devServer.contentBase = path.resolve(__dirname, "dist");

environment.loaders.prepend('typescript', typescript)
module.exports = environment;
