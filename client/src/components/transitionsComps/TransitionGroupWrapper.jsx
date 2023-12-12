"use client";
import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const TransitionGroupWrapper = ({
  items,
  timeout,
  classNames,
  keyExtractor,
  children,
}) => {
  return (
    <TransitionGroup>
      {items.map((item) => (
        <CSSTransition
          key={keyExtractor(item)}
          timeout={timeout}
          classNames={classNames}
        >
          {children(item)}
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default TransitionGroupWrapper;
