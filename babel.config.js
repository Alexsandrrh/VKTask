const IS_DEV = process.env.NODE_ENV === "development";

module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    IS_DEV && "react-refresh/babel",
  ].filter(Boolean),
};
