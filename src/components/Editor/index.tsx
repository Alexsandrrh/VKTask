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

// const test =
//   "Привет, @tc!\n" +
//   "Выложил тестовое в репозиторий\n" +
//   "на почту coolcoder@ya.ru #nofilters\n" +
//   "https://github.com/CoolCoder/task 🔥🔥🔥\n" +
//   "Было непросто, но весело. Если что, пиши\n" +
//   "на почту coolcoder@ya.ru #nofilters";

const Editor = () => {
  const [isOpenEmoji, setToggleEmoji] = useState(false);
  const input: RefObject<HTMLDivElement> = useRef(null);
  const view: RefObject<HTMLDivElement> = useRef(null);
  const buttonEmoji: RefObject<HTMLDivElement> = useRef(null);
  let timer: any = null;

  const prettyText = (value: string) => {
    const PATTERNS = {
      USER: /(^|\s)@[a-zA-Z0-9][\w-]*\b/g,
      URL: new RegExp(
        "(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?"
      ),
      EMOJI:
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi,
      EMAIL:
        /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
      HASHTAG: /(^|\s)#[a-zA-Z0-9][\w-]*\b/g,
    };
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      // Find @...
      value = value.replace(
        PATTERNS.USER,
        (v) => `<a data-type="user" href="${v.trim()}">${v}</a>`
      );

      // Find #...
      value = value.replace(
        PATTERNS.HASHTAG,
        (v) => `<a data-type="hashtag" href="${v}">${v}</a>`
      );

      // Find Email
      value = value.replace(
        PATTERNS.EMAIL,
        (v) => `<a data-type="email" href="mailto:${v}">${v}</a>`
      );

      // Find URLs
      value = value.replace(
        PATTERNS.URL,
        (v) => `<a data-type="url" href="${v}">${v}</a>`
      );

      // Set pretty value
      if (input.current) {
        input.current.innerHTML = value;
      }
    }, 1000);
  };

  const handleChange = (e: ChangeEvent<HTMLDivElement>) => {
    // prettyText(e.target.innerHTML);
  };

  const handleSelect = (payload: { type: string; value: string }) => {
    if (input.current) {
      if (payload.type === "emoji") {
        input.current.innerHTML += `<img data-type="emoji" alt="Эмодзи" src="${payload.value}">`;
        // prettyText(input.current.innerHTML);
      }
    }
  };

  // Открытие и закрытие окна emoji
  const handleClick = () => {
    setToggleEmoji(!isOpenEmoji);
    const timeOut = () =>
      setTimeout(() => {
        setToggleEmoji(false);
        window.removeEventListener("click", onClick);
        view.current?.removeEventListener("mouseenter", onEnter);
        view.current?.removeEventListener("mouseleave", onLeave);
      }, 700);
    let timer: any = timeOut();

    const onEnter = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    const onLeave = () => {
      if (!timer) {
        timer = timeOut();
      }
    };
    const onClick = (e) => {
      if (
        !view.current?.contains(e.target) &&
        !buttonEmoji.current?.contains(e.target)
      ) {
        setToggleEmoji(false);
      }
    };

    window.addEventListener("click", onClick);
    view.current?.addEventListener("mouseenter", onEnter);
    view.current?.addEventListener("mouseleave", onLeave);
  };

  // Keydown Event
  const keydownEvent = (e: KeyboardEvent) => {
    // On Tab
    if (e.keyCode === 9) {
      setToggleEmoji(!isOpenEmoji);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keydownEvent);

    return () => {
      window.removeEventListener("keydown", keydownEvent);
    };
  });

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
        title="Используйте TAB, чтобы быстрее открывать смайлы"
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
