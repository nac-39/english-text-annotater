import React, { useRef, useState } from "react";
import { Text } from "../types/Text";

export const PrettyText = (props: { text: Text; showRuby: boolean; updateValue?: (text: Text) => void }) => {
  const [value, setValue] = useState(props.text);
  const [isHover, setIsHover] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const isShow = isHover || isLocked;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnClick = (e: React.MouseEvent) => {
    // setIsLocked(!isLocked);
    if (inputRef && inputRef.current) inputRef.current.focus();
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
    <span className="relative" onClick={handleOnClick} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
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
