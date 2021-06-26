import React from "react";
import styles from "./Emoji.module.css";
import cn from "classnames";

interface Props {
  className: string;
  onClick: (e: any) => void;
}

const Emoji = ({ className, onClick }: Props) => {
  return (
    <div role="button" className={styles.Emoji} onClick={onClick}>
      <div className={styles.EmojiShadow}>
        <span className={cn(styles.EmojiIcon, className)} />
      </div>
    </div>
  );
};

export default Emoji;
