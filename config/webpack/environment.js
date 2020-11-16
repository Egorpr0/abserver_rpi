const { environment } = require("@rails/webpacker");

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

module.exports = environment;
