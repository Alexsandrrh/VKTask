import React, {
  useRef,
  useState,
  RefObject,
  ChangeEvent,
  useEffect,
} from "react";
import styles from "./Editor.module.css";
import IconSmile from "../../assets/icons/icon-smile.svg";
import Icon from "../Commons/Icon";
import EmojiView from "../EmojiView";

const Editor = () => {
  const [isOpenEmoji, setToggleEmoji] = useState(false);
  const input: RefObject<HTMLDivElement> = useRef(null);
  const view: RefObject<HTMLDivElement> = useRef(null);
  const buttonEmoji: RefObject<HTMLDivElement> = useRef(null);

  const handleChange = (e: ChangeEvent<HTMLDivElement>) => {
    console.log(e.target.innerHTML);
  };

  const handleSelect = (payload: { type: string; value: string }) => {
    if (input.current) {
      if (payload.type === "emoji") {
        input.current.innerHTML += `<img data-type="emoji" alt="Эмодзи" src="${payload.value}">`;
      }
    }
  };

  // Открытие и закрытие окна emoji
  const handleClick = () => {
    setToggleEmoji(!isOpenEmoji);
  };

  return (
    <div className={styles.Editor}>
      <div
        className={styles.EditorInput}
        ref={input}
        data-placeholder="Ваше сообщение"
        onInput={handleChange}
        contentEditable
      />

      {/* Emoji */}
      <EmojiView refView={view} isOpen={isOpenEmoji} onSelect={handleSelect} />
      <div
        role="button"
        ref={buttonEmoji}
        onClick={handleClick}
        className={styles.EditorButtonEmoji}
      >
        <Icon icon={IconSmile} className={styles.EditorButtonIcon} />
      </div>
    </div>
  );
};

export default Editor;
