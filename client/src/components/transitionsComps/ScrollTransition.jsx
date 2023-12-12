"use client";
import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

const ScrollTransition = ({ children, timeout, classNames }) => {
  const [isVisible, setIsVisible] = useState(false);

  const onScroll = () => {
    if (window.scrollY > 100) {
      // Adjust this value based on when you want the component to appear
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <CSSTransition
      in={isVisible}
      timeout={timeout}
      classNames={classNames}
      unmountOnExit
    >
      {children}
    </CSSTransition>
  );
};

export default ScrollTransition;
