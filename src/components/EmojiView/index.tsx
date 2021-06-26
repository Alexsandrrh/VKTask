import React, { Component, MouseEvent } from "react";
import styles from "./EmojiView.module.css";
import Icon from "../Commons/Icon";
import IconSmile from "../../assets/icons/icon-smile.svg";
import IconClock from "../../assets/icons/icon-clock.svg";
import EmojiSection from "../EmojiSection";
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

interface IEmoji {
  shortName: string;
  className: string;
  image: string;
}

interface IEmojiSection {
  title: string;
  items: IEmoji[];
}

interface ViewProps {
  isOpen: boolean;
  refView: any;
  onSelect: (payload: { type: string; value: string }) => void;
}

interface ViewState {
  currentTab: string;
  oftenUsed: any[];
  emoji: IEmojiSection[];
}

class EmojiView extends Component<ViewProps, ViewState> {
  constructor(props: ViewProps) {
    super(props);

    this.state = {
      emoji: [],
      currentTab: "emoji",
      oftenUsed: JSON.parse(localStorage.getItem("oftenUsed") ?? "[]"),
    };

    this.handleEmojiClick = this.handleEmojiClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  componentDidMount() {
    import(/* webpackChunkName: "emoji-data" */ "../../emoji.json").then(
      ({ default: data }) => {
        this.setState({ ...this.state, emoji: data });
      }
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<ViewProps>) {
    if (!nextProps.isOpen && this.state.currentTab !== "emoji") {
      setTimeout(
        () => this.setState({ ...this.state, currentTab: "emoji" }),
        100
      );
    }
  }

  handleEmojiClick = (emoji: any) => {
    const { onSelect } = this.props;
    const { oftenUsed } = this.state;
    return () => {
      let payload;
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
    const { oftenUsed, emoji } = this.state;
    const tabsViews = [
      {
        view: emoji.map(({ title, items }, key) => (
          <EmojiSection key={key} title={title}>
            {items.map((emoji, index) => (
              <Emoji
                onClick={this.handleEmojiClick(emoji)}
                key={emoji.shortName}
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
        <div className={styles.EmojiViewBody}>
          <div className={styles.EmojiViewItems}>{current?.view}</div>
          <div className={styles.EmojiViewTabs}>
            {tabsViews.map((item) => (
              <EmojiViewTab
                key={item.name}
                isActive={item.name === this.state.currentTab}
                onClick={this.handleTabClick(item.name)}
                icon={item.icon}
              />
            ))}
          </div>
        </div>

        <svg
          width="22"
          height="13"
          viewBox="0 0 22 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.EmojiViewСorner}
        >
          <g filter="url(#filter0_d)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 8C8.19927 8 6.19955 3 3 3H11H19C15.7982 3 13.8007 8 11 8Z"
              fill="#EBEEF2"
            />
            <path
              d="M19 3.5V3V2.5H11H3V3V3.5C3.66322 3.5 4.28976 3.75772 4.92251 4.19315C5.56039 4.6321 6.16731 5.22484 6.796 5.85355C6.8395 5.89705 6.88314 5.94077 6.92692 5.98462C7.50164 6.56029 8.09989 7.15953 8.72031 7.62019C9.39111 8.11825 10.1461 8.5 11 8.5C11.854 8.5 12.6088 8.11824 13.2794 7.62015C13.8995 7.15965 14.4973 6.56065 15.0717 5.98518C15.1157 5.94113 15.1595 5.89721 15.2032 5.85351C15.8317 5.22482 16.4386 4.6321 17.0765 4.19317C17.7093 3.75777 18.3361 3.5 19 3.5Z"
              stroke="#C5D0DB"
            />
          </g>
          <rect x="2" y="1" width="18" height="2" fill="#EBEEF2" />
          <defs>
            <filter id="filter0_d" x="0" y="0" width="22" height="13">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1.5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
    );
  }
}

export default EmojiView;
