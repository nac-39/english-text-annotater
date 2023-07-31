import React, { useState } from "react";
import { convertText2TextType } from "./util/convert";
import { SmartText } from "./components/SmartText";

const App = () => {
  const initialWords = convertText2TextType(
    "At the lake shore there was another rowboat drawn up. The two Indians stood waiting. "
  );
  const [words, setWords] = useState(() => initialWords);
  const [ordinal, setOrdinal] = useState("");
  const [showRuby, setShowRuby] = useState(false);
  const [searchQuery, setSearchQuery] = useState("意味");
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const handleOrdinalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrdinal(e.target.value);
  };

  const selectedIds = Array.from(selected)
    .sort((a, b) => a - b)
    .join(", ");

  return (
    <div className=" max-w-lg">
      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        テキスト
      </label>
      <textarea
        id="message"
        rows={4}
        value={ordinal}
        onChange={handleOrdinalChange}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Input your text here..."
      ></textarea>
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
      <button
        onClick={() => setShowRuby(!showRuby)}
        className="px-2 py-1 text-blue-500 border border-blue-500 font-semibold rounded hover:bg-blue-100"
      >
        ルビ切り替え
      </button>
      <div>
        <label htmlFor="searchQuery">検索ワード「[単語] {searchQuery}」</label>
        <input
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="add search query here..."
        />
      </div>
      <div>showRuby= {showRuby ? "true" : "false"}</div>
      <div>ordinal = {words.map((w) => w.word).join(",")}</div>
      <div className=" h-80">selected= {selectedIds}</div>
      <SmartText
        text={words}
        searchQuery={searchQuery}
        showRuby={showRuby}
        updateSelected={setSelected}
        updateWords={setWords}
      />
    </div>
  );
};

export default App;
