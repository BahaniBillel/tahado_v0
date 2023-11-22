import React from "react";

// Components
import SimilarCategories from "../../../components/SimilarCategories";
import NewsletterRibbon from "../../../components/NewsletterRibbon";

import BottomNavigation from "../../../components/BottomNavigation";
import DynamicPageSkelton from "../../../components/DynamicPageSkelton";

// APIs
import { FetchGifts } from "../../api/giftsAPIs";

async function GiftDetail({ params }) {
  const gifts = await FetchGifts();
  const pageUrl = params.name;

  const matchingProduct = gifts.find(
    (gift) => encodeURIComponent(gift.url) === pageUrl
  );

  console.log("matching product", matchingProduct);

  if (!matchingProduct) {
    // Handle the case where no matching product is found
    return <div>Product not found </div>;
  }

  console.log(gifts);
  const addItemToBasket = async () => {
    "use server";
  };

  return (
    <div className="w-full flex flex-col md:flex-col  md:px-28 pt-0 md:pt-10 space-y-10 md:space-y-10 pb-24">
      <DynamicPageSkelton
        data={matchingProduct}
        giftId={matchingProduct.gift_id}
        addItem={addItemToBasket}
      />

      <section className="h-80 py-1 bg-coralPinkLight/50 flex flex-col items-center justify-start px-4 mt-10 ">
        <p className="smalltitle">منتوجات لنفس الحرفي</p>
      </section>

      <section className="h-80 py-1 bg-coralPinkLight/50 flex flex-col items-center justify-start px-4 mt-10 ">
        <p className="smalltitle"> ربما تعجبك هاته الهدايا أيضا </p>
      </section>

      <section>
        <SimilarCategories />
        <NewsletterRibbon />
      </section>
      <BottomNavigation />
    </div>
  );
}

export default GiftDetail;
