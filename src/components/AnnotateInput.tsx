import React, { ReactElement, useState } from "react";

type Props = {
  children: ReactElement;
};

export const AnnotateInput = (prop: Props) => {
  const [show, setShow] = useState(false);
  return <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
    <input />
  </div> ? (
    show
  ) : (
    <></>
  );
};
