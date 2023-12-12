import ProductsLine from "../components/layouts/ProductsLine";
import SectionLayout01 from "../components/layouts/SectionLayout01";
import SectionLayout02 from "../components/layouts/SectionLayout02";
import SectionLayout03 from "../components/layouts/SectionLayout03";
import SectionLayout04 from "../components/layouts/SectionLayout04";
import Example from "../components/example";

// Apollo Client for linking backend graphQL

import TextGraphql from "../components/TextGraphql";
import { getClient } from "../app/lib/client";
import { GET_OCCASIONS, GET_PORODUCT_OCCASION } from "../graphql/querries";
import MiddleHeader from "../components/headers/middleHeader";
import HeroImage01 from "../components/HeroImage01";

export default async function Home() {
  const client = getClient();
  // Use the client instance to query data for occasions
  const { data: occasionsData } = await client.query({
    query: GET_OCCASIONS,
    fetchPolicy: "network-only",
    context: {
      fetchOptions: {
        next: { revalidate: 5 },
      },
    },
  });

  // Use the client instance to query data for product occasions
  const { data: productOccasionData } = await client.query({
    query: GET_PORODUCT_OCCASION,
    fetchPolicy: "network-only",
    context: {
      fetchOptions: {
        next: { revalidate: 5 },
      },
    },
  });

  // console.log("productOccasionData from home", productOccasionData);

  const occasionsArray = occasionsData.occasions.map(
    (occasion) => occasion.name
  );

  console.log(productOccasionData.products.length);
  return (
    <main className=" relative">
      <HeroImage01 />
      <MiddleHeader />

      <Example />
      <SectionLayout04 />
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
      <SectionLayout03 />
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
