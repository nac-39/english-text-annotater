import { on } from "events";
import React, { useRef, useState } from "react";
import { Text } from "../types/Text";

type Props = {
  text: Text;
  showRuby: boolean;
  updateValue?: (text: Text) => void;
  searchQuery?: string;
};

export const PrettyText = (props: Props) => {
  const [value, setValue] = useState(props.text);
  const [isHover, setIsHover] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const isShow = isHover || isLocked;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnSingleClick = () => {
    if (inputRef && inputRef.current) inputRef.current.focus();
    setShowSearch(!showSearch);
  };

  const handleOnDoubleClick = () => {
    onClickSearch();
  };

  const onClickSearch = () => {
    setShowSearch(!showSearch);
    window.open(`https://www.google.com/search?q=${value.word} ${props.searchQuery}`, "_blank", "noopener noreferrer");
  };
  let clickCount = 0;
  const handleSingleOrDoubleClick = () => {
    clickCount++;
    if (clickCount < 2) {
      setTimeout(() => {
        if (1 < clickCount) {
          handleOnDoubleClick();
        } else {
          handleOnSingleClick();
        }
        clickCount = 0;
      }, 200);
    }
  };
  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = { word: value.word, annotation: e.target.value, canAnnotate: value.canAnnotate };
    setValue(newText);
    // 親コンポーネントの値も更新
    if (props.updateValue) props.updateValue(newText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    // エンターキーで入力終われる
    if (e.key === "Enter") {
      setIsLocked(false);
      setIsHover(false);
      setShowSearch(false);
    }
  };

  if (props.showRuby) {
    return (
      <ruby style={{ rubyPosition: "under" }}>
        {props.text.word}{" "}
        {props.text.annotation && (
          <>
            {" "}
            <rp>(</rp>
            <rt className=" text-center text-orange-300">{props.text.annotation}</rt>
            <rp>)</rp>
          </>
        )}
      </ruby>
    );
  }

  return (
    <span
      className="relative cursor-pointer"
      onClick={() => handleSingleOrDoubleClick()}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
        setShowSearch(false);
      }}
    >
      {showSearch && value.word && (
        <span className=" rounded-full bg-gradient-to-tr bg-yellow-300 p-0.5 absolute -top-8 left-0" onClick={onClickSearch}>
          調
        </span>
      )}
      <span className={(isHover ? "text-red-400" : "") + (value.annotation?.length ? "underline" : "")}>{value.word}</span>
      {isShow && value.word && value.canAnnotate && (
        <input
          ref={inputRef}
          placeholder="annotate..."
          className=" z-50 absolute -bottom-7 left-0 shadow appearance-none border rounded w-min px-1 py-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={value.annotation}
          onChange={handleChangeValue}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        />
      )}
    </span>
  );
};
