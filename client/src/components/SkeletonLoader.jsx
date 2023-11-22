import React from "react";

const SkeletonImage = () => {
  return (
    <div
      className="skeleton-image"
      style={{
        backgroundImage:
          "linear-gradient(-90deg, #f0f0f0 0%, #f5f5f5 50%, #f0f0f0 100%)",
      }}
    ></div>
  );
};

export default SkeletonImage;
