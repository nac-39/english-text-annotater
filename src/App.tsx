import React, { useState } from "react";
import { convertText2TextType } from "./util/convert";
import { PrettyText } from "./components/PrettyText";
import { Text } from "./types/Text";

const App = () => {
  const initialWords = convertText2TextType("At the lake shore there was another rowboat drawn up. The two Indians stood waiting. ");
  const [words, setWords] = useState(initialWords);
  const [ordinal, setOrdinal] = useState("");
  const [showRuby, setShowRuby] = useState(false);
  const updateData = (text: Text, index: number) => {
    setWords(words.map((word, i) => (i === index ? text : word)));
  };
  const handleOrdinalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrdinal(e.target.value);
  };
  return (
    <div className=" max-w-lg">
      <textarea value={ordinal} onChange={handleOrdinalChange}></textarea>
      <button
        onClick={() =>
          setWords(() => {
            const newObj = convertText2TextType(ordinal);
            return newObj;
          })
        }
        className="px-2 py-1 text-blue-500 border border-blue-500 font-semibold rounded hover:bg-blue-100"
      >
        文章を適用
      </button>
      <button onClick={() => setShowRuby(!showRuby)} className="px-2 py-1 text-blue-500 border border-blue-500 font-semibold rounded hover:bg-blue-100">
        ルビ切り替え
      </button>
      <div>showRuby= {showRuby ? "true" : "false"}</div>
      <div>
        {words.map((word, index) => (
          <>
            {word.canAnnotate && index > 0 && words[index - 1].word != '"' ? <PrettyText text={{ word: " ", canAnnotate: false }} key={String(index * 2) + word.word} showRuby={false} /> : <></>}
            <PrettyText text={word} key={String(index * 2 + 1) + word.word} showRuby={showRuby} updateValue={(text) => updateData(text, index)} />
          </>
        ))}
      </div>
    </div>
  );
};

export default App;
