"use client";
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

function ThumbnailPlugin(mainRef) {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx) {
      slider.slides[idx].classList.add("active");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

export default function ThumbnailsKeenSlider({ data }) {
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
  });
  const [thumbnailRef] = useKeenSlider(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <>
      <div ref={sliderRef} className="keen-slider  ">
        {data.map((image, index) => (
          <div key={index} className="keen-slider__slide relative">
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover object-center"
              fill
            />
          </div>
        ))}
      </div>

      <div ref={thumbnailRef} className="keen-slider thumbnail">
        {data.map((image, index) => (
          <div key={index} className="keen-slider__slide">
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover object-center"
              fill
            />
          </div>
        ))}
      </div>
    </>
  );
}
