import ProductsLine from "../components/layouts/ProductsLine";
import SectionLayout01 from "../components/layouts/SectionLayout01";
import SectionLayout02 from "../components/layouts/SectionLayout02";

// Apollo Client for linking backend graphQL

import TextGraphql from "../components/TextGraphql";
import { getClient } from "../app/lib/client";
import { GET_OCCASIONS, GET_PORODUCT_OCCASION } from "../graphql/querries";
import CheckoutProduct from "../components/checkout/checkoutProduct";

export default async function Home() {
  // const gifts = await FetchGifts();

  const client = getClient();
  // Use the client instance to query data for occasions
  const { data: occasionsData } = await client.query({
    query: GET_OCCASIONS,
  });

  // Use the client instance to query data for product occasions
  const { data: productOccasionData } = await client.query({
    query: GET_PORODUCT_OCCASION,
  });

  console.log("productOccasionData", productOccasionData);

  const occasionsArray = occasionsData.occasions.map(
    (occasion) => occasion.name
  );

  return (
    <main className="">
      <TextGraphql />

      <ProductsLine
        giftsData={productOccasionData.products}
        lineID={1}
        bottomLine={false}
        occasionLabel={occasionsArray[0]}
        occasionName={occasionsArray[0]}
      />

      <ProductsLine
        giftsData={productOccasionData.products}
        lineID={1}
        bottomLine={false}
        occasionLabel={occasionsArray[1]}
        occasionName={occasionsArray[1]}
      />
      <ProductsLine
        giftsData={productOccasionData.products}
        lineID={1}
        bottomLine={false}
        occasionLabel={occasionsArray[2]}
        occasionName={occasionsArray[2]}
      />
      <SectionLayout01 />
      <ProductsLine
        giftsData={productOccasionData.products}
        lineID={1}
        bottomLine={false}
        occasionLabel={occasionsArray[3]}
        occasionName={occasionsArray[3]}
      />
      <SectionLayout02 />
      <ProductsLine
        giftsData={productOccasionData.products}
        lineID={1}
        bottomLine={false}
        occasionLabel={occasionsArray[4]}
        occasionName={occasionsArray[4]}
      />
      <ProductsLine
        giftsData={productOccasionData.products}
        lineID={1}
        bottomLine={false}
        occasionLabel={occasionsArray[5]}
        occasionName={occasionsArray[5]}
      />
      <ProductsLine
        giftsData={productOccasionData.products}
        lineID={1}
        bottomLine={false}
        occasionLabel={occasionsArray[6]}
        occasionName={occasionsArray[6]}
      />
    </main>
  );
}
