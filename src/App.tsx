import React, { useState } from "react";
import SelectionArea, { SelectionEvent } from "@viselect/react";
import { convertText2TextType } from "./util/convert";
import { PrettyText } from "./components/PrettyText";
import { Text } from "./types/Text";

const App = () => {
  const initialWords = convertText2TextType(
    "At the lake shore there was another rowboat drawn up. The two Indians stood waiting. "
  );
  const [words, setWords] = useState(initialWords);
  const [ordinal, setOrdinal] = useState("");
  const [showRuby, setShowRuby] = useState(false);
  const [searchQuery, setSearchQuery] = useState("意味");
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const updateData = (text: Text, index: number) => {
    setWords(words.map((word, i) => (i === index ? text : word)));
  };
  const handleOrdinalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrdinal(e.target.value);
  };

  const selectedIds = Array.from(selected)
    .sort((a, b) => a - b)
    .join(", ");
  const extractIds = (els: Element[]): number[] =>
    els
      .map((v) => v.getAttribute("data-key"))
      .filter(Boolean)
      .map(Number);

  const onStart = ({ event, selection }: SelectionEvent) => {
    if (!event?.ctrlKey && !event?.metaKey) {
      selection.clearSelection();
      setSelected(() => new Set());
    }
  };

  const onMove = ({ store: { selected } }: SelectionEvent) => {
    setSelected((prev) => {
      const next = new Set<number>();
      extractIds(selected).forEach((id) => next.add(id));

      console.log(next);
      const min = Math.min(...Array.from(next));
      const max = Math.max(...Array.from(next));
      for (let i = min; i <= max; i += 2) {
        next.add(i);
      }
      return next;
    });
  };

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
      <div className=" h-80">selected= {selectedIds}</div>
      <SelectionArea
        className={showRuby ? "" : "container"}
        onStart={onStart}
        onMove={onMove}
        selectables={".selectable"}
      >
        {words.map((word, index) => (
          <>
            {word.canAnnotate &&
            index > 0 &&
            !/[\("\[]/.test(words[index - 1].word) ? (
              <PrettyText
                isSelected={false}
                text={{ word: " ", canAnnotate: false }}
                key={String(index * 2) + word.word}
                showRuby={false}
              />
            ) : (
              <></>
            )}
            <PrettyText
              text={word}
              isSelected={selected.has(index * 2 + 1)}
              key={String(index * 2 + 1) + word.word}
              showRuby={showRuby}
              updateValue={(text) => updateData(text, index)}
              searchQuery={searchQuery}
              divProps={{ "data-key": index * 2 + 1 }}
            />
          </>
        ))}
      </SelectionArea>
    </div>
  );
};

export default App;
