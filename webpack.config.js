const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const IS_DEV = process.env.NODE_ENV === "development";
const styleLoader = IS_DEV ? "style-loader" : MiniCssExtractPlugin.loader;

module.exports = {
  entry: path.resolve("src/index.tsx"),
  output: {
    filename: "assets/scripts/[name]-[fullhash:10].js",
    path: path.resolve("dist"),
    publicPath: "/",
  },
  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".json",
      ".css",
      ".sass",
      ".scss",
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: ["babel-loader"],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              modules: "global",
              importLoaders: 2,
              sourceMap: false,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: IS_DEV
                  ? "[name]_[local]_[hash:base64:10]"
                  : "[hash:base64:7]",
              },
              importLoaders: 2,
              sourceMap: false,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/,
        use: ["svg-sprite-loader"],
      },
      {
        test: /\.(gif|png|jpg|jpeg)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "./src/assets/images"),
        use: "url-loader?limit=10000&name=assets/images/[name]-[hash].[ext]",
      },

      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ["file-loader"] },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/assets/images/emoji", to: "./assets/images/emoji" },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve("src/index.ejs"),
      inject: "body",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin(),
    new MiniCssExtractPlugin({
      filename: "assets/css/main-[hash].css",
      chunkFilename: "[id]-[hash].css",
    }),
  ].filter(Boolean),
  devServer: {
    port: 3000,
    contentBase: path.resolve("dist"),
    hot: true,
  },
};
