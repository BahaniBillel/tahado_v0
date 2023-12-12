"use client";
import React from "react";
import ScrollTransition from "./transitionsComps/ScrollTransition";

const Example = () => {
  const [show, setShow] = React.useState(true);

  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle</button>
      <ScrollTransition timeout={300} classNames="fade">
        <div>I will fade in and out</div>
      </ScrollTransition>
    </>
  );
};

export default Example;
