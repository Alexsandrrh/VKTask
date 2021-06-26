import React, { ReactNode } from "react";
import styles from "./EmojiSection.module.css";

interface Props {
  title: string;
  children: ReactNode;
}

const EmojiSection = ({ title, children }: Props) => {
  return (
    <div className={styles.EmojiSection}>
      <span className={styles.EmojiSectionTitle}>{title}</span>
      <div className={styles.EmojiSectionBody}>{children}</div>
    </div>
  );
};

export default EmojiSection;
