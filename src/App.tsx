import React from "react";
import logo from "./logo.svg";
import { convertText2TextType } from "./util/convert";
import { PrettyText } from "./components/PrettyText";

const App = () => {
  const words = convertText2TextType("hello, world! the world is pretty.");
  return (
    <div className="">
      {words.map((word, index) => (
        <>
          {word.canAnnotate && index > 0 ? <PrettyText text={{ word: " ", canAnnotate: false }} key={index * 2} /> : <></>}
          <PrettyText text={word} key={index * 2 + 1} />
        </>
      ))}
    </div>
  );
};

export default App;
