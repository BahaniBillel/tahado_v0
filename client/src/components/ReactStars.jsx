"use client";
import React from "react";

import ReactStars from "react-stars";

function ReactStarsComp() {
  return (
    <div className="flex flex-row items-center flex-nowrap justify-center">
      <span className="text-sm text-charcoal">(45)</span>
      <ReactStars count={5} size={18} color2={"#ffd700"} value={4.5} />
    </div>
  );
}

export default ReactStarsComp;
