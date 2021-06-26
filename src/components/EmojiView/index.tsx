import React, { Component, MouseEvent } from "react";
import styles from "./EmojiView.module.css";
import Icon from "../Commons/Icon";
import IconSmile from "../../assets/icons/icon-smile.svg";
import IconClock from "../../assets/icons/icon-clock.svg";
import EmojiSection from "../EmojiSection";
import emoji from "../../emoji.json";
import Emoji from "../Emoji";

interface TabProps {
  icon: any;
  isActive: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const EmojiViewTab = ({ icon, isActive, onClick }: TabProps) => (
  <button
    type="button"
    onClick={onClick}
    className={isActive ? styles.EmojiViewTabActive : styles.EmojiViewTab}
  >
    <Icon icon={icon} className={styles.EmojiViewTabIcon} />
  </button>
);

interface ViewProps {
  isOpen: boolean;
  refView: any;
  onSelect: (payload: { type: string; value: string }) => void;
}

interface ViewState {
  currentTab: string;
  oftenUsed: any[];
}

class EmojiView extends Component<ViewProps, ViewState> {
  constructor(props: ViewProps) {
    super(props);

    this.state = {
      currentTab: "emoji",
      oftenUsed: JSON.parse(localStorage.getItem("oftenUsed") ?? "[]"),
    };

    this.handleEmojiClick = this.handleEmojiClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleEmojiClick = (emoji: any) => {
    const { onSelect } = this.props;
    const { oftenUsed } = this.state;
    return () => {
      let payload;
      // Находим объект
      const used = oftenUsed.find((item) => item.shortName === emoji.shortName);

      if (used) {
        payload = oftenUsed
          .filter((item) => item.shortName !== emoji.shortName)
          .concat([{ ...used, countUsed: used.countUsed + 1 }]);
      } else {
        payload = [...oftenUsed, { ...emoji, countUsed: 1 }];
      }

      // Сортировка emoji
      payload = payload.sort((a, b) => b.countUsed - a.countUsed);

      // Отвечаем на выбор
      onSelect({ type: "emoji", value: emoji.image });

      // Сохраняем
      this.setState({
        ...this.state,
        oftenUsed: payload,
      });
      localStorage.setItem("oftenUsed", JSON.stringify(payload));
    };
  };

  handleTabClick = (currentTab: string) => {
    return () => {
      this.setState({ ...this.state, currentTab });
    };
  };

  render() {
    const { isOpen, refView } = this.props;
    const { oftenUsed } = this.state;
    const tabsViews = [
      {
        view: emoji.map(({ title, items }, key) => (
          <EmojiSection key={key} title={title}>
            {items.map((emoji, index) => (
              <Emoji
                onClick={this.handleEmojiClick(emoji)}
                key={index}
                className={emoji.className}
              />
            ))}
          </EmojiSection>
        )),
        icon: IconSmile,
        name: "emoji",
      },
      {
        view: (
          <EmojiSection title="Часто используемые">
            {oftenUsed
              .slice(0, oftenUsed.length > 25 ? 25 : oftenUsed.length - 1)
              .map((emoji, index) => (
                <Emoji
                  onClick={this.handleEmojiClick(emoji)}
                  key={index}
                  className={emoji.className}
                />
              ))}
          </EmojiSection>
        ),
        icon: IconClock,
        name: "often-used",
      },
    ];
    const current = tabsViews.find(
      (item) => item.name === this.state.currentTab
    );

    return (
      <div
        ref={refView}
        className={isOpen ? styles.EmojiViewActive : styles.EmojiView}
      >
        <div className={styles.EmojiViewBody}>{current?.view}</div>
        <div className={styles.EmojiViewTabs}>
          {tabsViews.map((item) => (
            <EmojiViewTab
              isActive={item.name === this.state.currentTab}
              onClick={this.handleTabClick(item.name)}
              icon={item.icon}
            />
          ))}
        </div>
        <svg
          className={styles.EmojiViewСorner}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="5"
          viewBox="0 0 16 5"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 5C5.19927 5 3.19955 0 0 0H16C12.7982 0 10.8007 5 8 5Z"
          />
        </svg>
      </div>
    );
  }
}

export default EmojiView;
