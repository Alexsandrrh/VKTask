const IS_DEV = process.env.NODE_ENV === "development";

const config = {
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

console.log(config);

module.exports = config;
