import React, { useState } from "react";
import { Text } from "../types/Text";

export const PrettyText = (props: { text: Text }) => {
  const [value, setValue] = useState(props.text);
  const [isHover, setIsHover] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const isShow = isHover || isLocked;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter") return;
    setIsLocked(false);
    setIsHover(false);
  };
  return (
    <span className="relative" onClick={(e) => setIsLocked(!isLocked)} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <span className={isHover ? "text-red-400" : ""}>{value.word}</span>
      {isShow && value.word && (
        <input
          placeholder="annotate..."
          className="absolute -bottom-8 left-0 shadow appearance-none border rounded w-min px-1 py-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={value.annotation}
          onChange={(e) => setValue({ word: value.word, annotation: e.target.value, canAnnotate: value.canAnnotate })}
          onKeyDown={handleKeyDown}
        />
      )}
    </span>
  );
};
