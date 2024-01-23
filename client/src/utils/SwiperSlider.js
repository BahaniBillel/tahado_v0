import { useRef, useEffect } from "react";
import { register } from "swiper/element/bundle";
import Image from "next/image";
import DefaultImage from "../../public/images/gift-close-up.jpg";

register();

export const SwiperSlider = ({ data }) => {
  const swiperElRef = useRef(null);

  useEffect(() => {
    // listen for Swiper events using addEventListener
    swiperElRef.current.addEventListener("progress", (e) => {
      const [swiper, progress] = e.detail;
      console.log(progress);
    });

    swiperElRef.current.addEventListener("slidechange", (e) => {
      console.log("slide changed");
    });
  }, []);

  return (
    <swiper-container
      ref={swiperElRef}
      slides-per-view="3"
      navigation="true"
      pagination="true"
    >
      {data.map((image, index) => (
        <swiper-slide className="relative" key={index}>
          <Image
            src={image || DefaultImage}
            alt={`Slide ${index + 1}`}
            className="h-full w-full object-cover object-center"
            width={900}
            height={900}
          />
        </swiper-slide>
      ))}
      ...
    </swiper-container>
  );
};
