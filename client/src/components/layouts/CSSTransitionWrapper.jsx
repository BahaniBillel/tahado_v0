import React from "react";
import { CSSTransition } from "react-transition-group";

const CSSTransitionWrapper = ({
  children,
  in: inProp,
  timeout = 300,
  classNames = "fade",
}) => {
  return (
    <CSSTransition
      in={inProp}
      timeout={timeout}
      classNames={classNames}
      unmountOnExit
    >
      {children}
    </CSSTransition>
  );
};

export default CSSTransitionWrapper;
