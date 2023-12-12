"use client";
import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";

// Components
import ProductLy01 from "../productsLayouts/ProdcutLy01";
import DefaultImage from "../../../public/images/defaultGiftImage.jpg";
import FadeTransition from "../transitionsComps/FadeTransition";

// Helpers
import { getImages, s3Client } from "../../helpers/s3Helpers";
import { useCustomSession } from "../../helpers/customSessionHook";
import { GetAllWishlist } from "../../app/api/wishlistAPIs";

const ProductsLine = ({
  lineID,
  giftsData,
  bottomLine,
  occasionLabel,
  occasionName,
}) => {
  // FETCHING IMAGES FROM AMAEZON S3
  const [images, setImages] = useState([]);
  const [giftImageMap, setGiftImageMap] = useState({}); // New state to map gift_ids to their images
  const { userId } = useCustomSession();
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // console.log("useEffect triggered");
    getImages(giftsData, setImages, setGiftImageMap);
  }, [giftsData]); // Dependency on 'data' so it re-runs when data changes

  // Images Carousel
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "free",

    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 1.2, spacing: 10 },
        loop: true,
        mode: "free",
      },
      "(min-width: 1360px)": {
        slides: { perView: 3.2, spacing: 20 },
        loop: true,
        mode: "free",
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  //  Find wishlist matching id
  const [wishlist, setWishlist] = useState(null); // Initialize to null

  useEffect(() => {
    // if GetAllWishlist is async
    const fetchWishlist = async () => {
      try {
        const fetchedWishlist = await GetAllWishlist();
        setWishlist(fetchedWishlist);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  // Later in your component
  useEffect(() => {
    if (wishlist) {
      // console.log(wishlist?.data?.wishlist); // Make sure wishlist and wishlist.data are not null
    }
  }, [wishlist]);

  // Filter giftsData based on occasionId

  const filteredGiftsData = giftsData.filter((gift) => {
    return gift.occasions.some((occasion) =>
      occasion.occasion.name.includes(occasionName)
    );
  });

  // console.log("filtered gift data ", giftsData);
  return (
    <div className=" md:px-32 mt-5 ">
      <div
        className={`navigation-wrapper   ${
          bottomLine ? "border-b border-charcoal/20" : null
        } py-5`}
      >
        <div>
          <div className="">
            <div class="inline-flex items-center justify-center w-full">
              <hr class="w-full h-px  my-8 bg-charcoal/20 border-0 dark:bg-gray-700" />
              <span
                class="absolute px-3  text-charcoal text-2xl -translate-x-1/2
               bg-white left-1/2 dark:text-charcoal dark:bg-gray-900 whitespace-pre"
              >
                {occasionLabel}
              </span>
            </div>
            <div ref={sliderRef} className="keen-slider">
              {filteredGiftsData.map((gift) => {
                const giftImages = giftImageMap[gift.gift_id] || []; // Retrieve images for this gift
                const mainImage = giftImages[0] || DefaultImage; // Use the first image or a default
                const secondImage = giftImages[1] || DefaultImage; // Use the first image or a default
                return (
                  <FadeTransition in={show}>
                    <div
                      className="keen-slider__slide py-5 "
                      key={gift.gift_id}
                    >
                      <ProductLy01
                        giftName={gift.giftname}
                        mainImage={mainImage} // Updated to use a mapped image
                        secondImage={secondImage}
                        price={gift.price}
                        link={gift.url}
                        user_id={userId}
                        product_id={gift.gift_id}
                        feature="New"
                        featureColor="turquoise"
                      />
                    </div>
                  </FadeTransition>
                );
              })}
            </div>
            <div className=" w-full flex flex-row items-center justify-center">
              <p className=" button ">عرض كل {occasionLabel}</p>
            </div>
          </div>
        </div>
        {/* {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </>
        )} */}
      </div>
    </div>
  );
};

export default ProductsLine;

// related to slider
function Arrow(props) {
  const disabeld = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabeld}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
