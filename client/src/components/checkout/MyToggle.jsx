"use client";
import { useState, Fragment } from "react";
import { Switch } from "@headlessui/react";

function MyToggle({
  initialEnabled = false,
  onToggle = () => {},
  enabledColor = "bg-blue-600",
  disabledColor = "bg-gray-200",
  ariaLabel = "Toggle",
}) {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleToggle = (newValue) => {
    setEnabled(newValue);
    onToggle(newValue); // Call the passed in callback
  };

  return (
    <Switch checked={enabled} onChange={handleToggle} as={Fragment}>
      {({ checked }) => (
        <button
          className={`${
            checked ? enabledColor : disabledColor
          } relative inline-flex h-6 w-11 items-center rounded-full`}
          aria-label={ariaLabel}
        >
          <span className="sr-only">{ariaLabel}</span>
          <span
            className={`${
              checked ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </button>
      )}
    </Switch>
  );
}

export default MyToggle;
