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

const test =
  "Привет, @tc!\n" +
  "Выложил тестовое в репозиторий\n" +
  "https://github.com/CoolCoder/task 🔥🔥🔥\n" +
  "Было непросто, но весело. Если что, пиши\n" +
  "на почту coolcoder@ya.ru #nofilters";

const Editor = () => {
  const [isOpenEmoji, setToggleEmoji] = useState(false);
  const input: RefObject<HTMLDivElement> = useRef(null);
  const view: RefObject<HTMLDivElement> = useRef(null);
  const buttonEmoji: RefObject<HTMLDivElement> = useRef(null);
  let timer: any = null;
  const pretty = (value: string) => {
    const PATTERNS = {
      URL: /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
      HASHTAG: /#(\w+)/g,
      EMAIL:
        /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
    };
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      // Set pretty value
      if (input.current) {
        input.current.innerHTML = value;
      }
    }, 1000);
  };

  const handleChange = (e: ChangeEvent<HTMLDivElement>) => {
    let value = e.target.innerHTML;
    pretty(value);
  };

  const handleSelect = (payload: { type: string; value: string }) => {
    if (input.current) {
      if (payload.type === "emoji") {
        input.current.innerHTML += `<img data-type="emoji" alt="Эмодзи" src="${payload.value}">`;
        pretty(input.current.innerHTML);
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
