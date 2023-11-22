"use client";
import React from "react";
import { persistStore } from "redux-persist";
import { store } from "../../../store/configureStore"; // Replace with the path to your store file

export const resetReduxPersist = async () => {
  await persistStore(store).purge();
  window.location.reload();
};

function Reset() {
  return (
    <div className="px-10 py-10">
      <button
        onClick={resetReduxPersist}
        className="bg-charcoal text-white rounded-md py-1 px-2 text-xs hover:scale-95 shadow-md"
      >
        Reset Store
      </button>
    </div>
  );
}

export default Reset;
