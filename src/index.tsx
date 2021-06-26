import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./assets/styles/main.scss";

const app = document.getElementById("app");
render(<App />, app);

if (module.hot) {
  module.hot.accept();
}
