import React, { useRef, useState, RefObject, ChangeEvent } from "react";
import styles from "./Editor.module.css";
import IconSmile from "../../assets/icons/icon-smile.svg";
import Icon from "../Commons/Icon";
import EmojiView from "../EmojiView";

// Настройки для редактора
const OPTIONS = {
  TIME_OUT: 300,
};

const Editor = () => {
  const [isOpenEmoji, setToggleEmoji] = useState(false);
  const input: RefObject<HTMLDivElement> = useRef(null);
  const view: RefObject<HTMLDivElement> = useRef(null);
  const buttonEmoji: RefObject<HTMLDivElement> = useRef(null);

  // Timeout
  let timeoutOutView: any = null;

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLDivElement>) => {
    console.log(e.target.innerHTML);
  };
  const handleSelect = (payload: { type: string; value: string }) => {
    if (input.current) {
      if (payload.type === "emoji") {
        input.current.innerHTML += `<img data-type="emoji" alt="Эмодзи" src="${payload.value}" />`;
      }
    }
  };
  const handlerMouseEnter = () => {
    if (timeoutOutView) {
      console.log("Удаление таймера перехода от ОКНА");
      clearTimeout(timeoutOutView);
      timeoutOutView = null;
    }

    if (!isOpenEmoji) {
      setToggleEmoji(true);
    }
  };

  const handlerMouseLeave = () => {
    console.log("Вышли с кнопки");
    console.log("Запуск таймера на переход");
    const handlerTimeout = () => {
      console.log("СРАБОТАЛ ТАЙМЕР => СБРОС");
      view.current?.removeEventListener("mouseenter", handlerMouseEnter);
      view.current?.removeEventListener("mouseleave", handlerMouseLeave);
      setToggleEmoji(false);
    };
    const timeoutOutButton = setTimeout(handlerTimeout, OPTIONS.TIME_OUT);
    const onOutView = () => setTimeout(handlerTimeout, OPTIONS.TIME_OUT);

    const handlerMouseEnter = (e: any) => {
      console.log("Переход на окно с эмодзи");

      console.log("Удаление таймера перехода от КНОПКИ");
      clearTimeout(timeoutOutButton);

      if (timeoutOutView) {
        console.log("Удаление таймера перехода от ОКНА");
        clearTimeout(timeoutOutView);
        timeoutOutView = null;
      }
    };

    const handlerMouseLeave = (e: any) => {
      console.log("Пользователь вышел из окна");

      if (!timeoutOutView) {
        timeoutOutView = onOutView();
      }
    };

    view.current?.addEventListener("mouseenter", handlerMouseEnter);
    view.current?.addEventListener("mouseleave", handlerMouseLeave);
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
        onMouseEnter={handlerMouseEnter}
        onClick={handlerMouseEnter}
        onMouseLeave={handlerMouseLeave}
        className={styles.EditorButtonEmoji}
      >
        <Icon icon={IconSmile} className={styles.EditorButtonIcon} />
      </div>
    </div>
  );
};

export default Editor;
