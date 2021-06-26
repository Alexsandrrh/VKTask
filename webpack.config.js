const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const WebpackBar = require("webpackbar");

const IS_DEV = process.env.NODE_ENV === "development";
const IS_PROD = process.env.NODE_ENV === "production";
const styleLoader = IS_DEV
  ? "style-loader"
  : {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: "../../",
      },
    };

module.exports = {
  mode: process.env.NODE_ENV,
  entry: { bundle: path.resolve("src/index.tsx") },
  output: {
    filename: "./assets/scripts/[name]-[fullhash:10].js",
    path: path.resolve("dist"),
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
                  : "[hash:base64:6]",
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
        use: "url-loader?limit=10000&name=./assets/images/[name]-[hash:10].[ext]",
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
      minify: IS_PROD && {
        html5: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: false,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributese: true,
        useShortDoctype: true,
      },
    }),
    IS_DEV && new webpack.HotModuleReplacementPlugin(),
    IS_DEV && new ReactRefreshPlugin(),
    new MiniCssExtractPlugin({
      filename: "./assets/css/main-[hash:10].css",
      chunkFilename: "[name]-[hash].css",
    }),

    IS_PROD &&
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            "gifsicle",
            "jpegtran",
            ["optipng", { optimizationLevel: 5 }],
            "svgo",
          ],
        },
      }),
    new WebpackBar({ name: "Client" }),
  ].filter(Boolean),
  optimization: {
    minimize: IS_PROD,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          enforce: true,
        },
      },
    },
    minimizer: IS_PROD
      ? [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
          new OptimizeCSSAssetsPlugin(),
        ]
      : [],
  },
  devServer: {
    contentBase: path.resolve("dist"),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 3000,
    stats: "errors-only",
  },
};
