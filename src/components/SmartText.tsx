import { useState } from "react";
import SelectionArea, { SelectionEvent } from "@viselect/react";
import { PrettyWord } from "../components/PrettyWord";
import { Text } from "../types/Text";

export type Mode = "edit" | "view";

type Props = {
  text: Text[];
  mode: "edit" | "view";
  searchQuery?: string;
  showRuby: boolean;
  updateSelected: (selected: Set<number>) => void;
  updateWords: (words: Text[]) => void;
};

export const SmartText = (props: Props) => {
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const noSpaceRxp = /[\("\[]/;
  const updateData = (text: Text, index: number) => {
    props.updateWords(props.text.map((word, i) => (i === index ? text : word)));
  };
  const searchInNewTab = () => {
    if (selected.size === 0) return;
    console.log("yes");
    const selectedText = props.text
      .filter((_, i) => selected.has(i * 2 + 1))
      .map((v) => v.word)
      .join(" ");
    window.open(
      `https://www.google.com/search?q=${selectedText} ${props.searchQuery}`,
      "_blank",
      "noopener noreferrer"
    );
  };
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
    setSelected(() => {
      const next = new Set<number>();
      extractIds(selected).forEach((id) => next.add(id));
      const min = Math.min(...Array.from(next));
      const max = Math.max(...Array.from(next));
      for (let i = min; i <= max; i += 2) {
        next.add(i);
      }
      props.updateSelected(next);
      return next;
    });
  };

  return (
    <SelectionArea
      className={props.mode == "edit" ? "container" : ""}
      onStart={onStart}
      onMove={onMove}
      selectables={".selectable"}
      behaviour={{
        overlap: "keep",
        intersect: "touch",
        startThreshold: 10,
        scrolling: {
          speedDivider: 10,
          manualSpeed: 750,
          startScrollMargins: { x: 0, y: 0 },
        },
      }}
    >
      {props.text.map((word, index) => (
        <>
          {word.canAnnotate &&
          index > 0 &&
          !noSpaceRxp.test(props.text[index - 1].word) ? (
            <PrettyWord
              isSelected={false}
              text={{ word: " ", canAnnotate: false }}
              mode={"view"}
              key={String(index * 2) + word.word}
              showRuby={false}
            />
          ) : (
            <></>
          )}
          <PrettyWord
            text={word}
            mode={props.mode}
            isSelected={selected.has(index * 2 + 1)}
            key={String(index * 2 + 1) + word.word}
            showRuby={props.showRuby}
            updateValue={(text) => updateData(text, index)}
            searchQuery={props.searchQuery}
            divProps={{ "data-key": index * 2 + 1 }}
            onClickSearch={searchInNewTab}
          />
        </>
      ))}
    </SelectionArea>
  );
};
