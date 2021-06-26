import React from "react";
import Editor from "./components/Editor";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.App}>
      <Editor />
    </div>
  );
};

export default App;
