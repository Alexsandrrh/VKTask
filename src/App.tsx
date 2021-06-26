import React from "react";
import Editor from "./components/Editor";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.App}>
      <h1 className={styles.AppTitle}>Привет, это поле ввода)</h1>
      <Editor />
    </div>
  );
};

export default App;
