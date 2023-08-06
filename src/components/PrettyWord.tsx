import React, { useRef, useState } from "react";
import { Text } from "../types/Text";
import { Mode } from "./SmartText";

type HTMLElementProps = JSX.IntrinsicElements &
  Record<
    keyof JSX.IntrinsicElements,
    { [p: `data-${string}`]: string | number }
  >;

type Props = {
  text: Text;
  showRuby: boolean;
  isSelected: boolean;
  mode: Mode;
  divProps?: HTMLElementProps["div"];
  updateValue?: (text: Text) => void;
  onClickSearch?: () => void;
  searchQuery?: string;
};

export const PrettyWord = (props: Props) => {
  const [isHover, setIsHover] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const Tag: keyof JSX.IntrinsicElements = props.showRuby ? "ruby" : "span";

  const inputRef = useRef<HTMLInputElement>(null);
  const isShowInput = isLocked && props.text.word && props.text.canAnnotate;

  const handleOnSingleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    // hack: vueのnextTickのようなもの。inputがDOMのアクティビティツリーに追加されるまで待つ
    setTimeout(() => {
      if (inputRef && inputRef.current) inputRef.current.focus();
    }, 0);
    if (e.ctrlKey || e.metaKey) {
      props.onClickSearch && props.onClickSearch();
    }
    if (props.text.canAnnotate) {
      setIsLocked(!isLocked);
      setIsHover(!isHover);
    }
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = {
      word: props.text.word,
      annotation: e.target.value,
      canAnnotate: props.text.canAnnotate,
    };
    // 親コンポーネントの値も更新
    if (props.updateValue) props.updateValue(newText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // 日本語入力中は無視
    // エンターキーで入力終われる
    if (e.key === "Enter") {
      setIsLocked(false);
      setIsHover(false);
    }
  };

  return (
    <Tag
      style={{ rubyPosition: "under" }}
      {...props.divProps}
      className={
        "relative cursor-pointer rounded-md py-0.5" +
        (props.isSelected && props.text.canAnnotate && props.mode === "edit"
          ? " selectable selected shadow-inner border-2 border-blue-400"
          : " selectable") +
        ((isHover || isLocked) &&
        props.text.canAnnotate &&
        props.mode === "edit"
          ? " text-red-400 shadow border"
          : "")
      }
      onClick={handleOnSingleClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
        setIsLocked(false);
      }}
    >
      <span className={props.text.annotation?.length ? "underline" : ""}>
        {props.text.word}
      </span>
      {props.mode === "edit" && props.text.canAnnotate && (
        <input
          ref={inputRef}
          placeholder="annotate..."
          className={
            (isShowInput ? "" : "hidden ") +
            " z-50 absolute -bottom-7 left-0 shadow appearance-none border rounded w-min px-1 py-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          }
          value={props.text.annotation || ""}
          onChange={handleChangeValue}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {props.showRuby && props.text.annotation && (
        <>
          {" "}
          <rp>(</rp>
          <rt className=" text-center text-orange-300">
            {props.text.annotation}
          </rt>
          <rp>)</rp>
        </>
      )}
    </Tag>
  );
};
