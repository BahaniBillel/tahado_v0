import React from "react";
import OccasionForm from "../../../components/occasion/occasionForm";
import { getClient } from "../../../app/lib/client";
import { GET_OCCASIONS } from "../../../graphql/querries";

async function AddOccasion() {
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

  console.log(occasionsData.occasions);

  return (
    <div
      className="flex fle-row mx-auto justify-start 
    items-start space-x-5 p-2 w-screen h-screen mt-8"
    >
      <div className=" w-3/4 p-4">
        <OccasionForm />
      </div>
      <div className="flex flex-col items-start w-1/4 h-full py-4 px-8 bg-lightGray ">
        <p className="font-bold">The Available Occasions :</p>
        {occasionsData.occasions.map((occasion) => (
          <ul className="list list-disc">
            <li key={occasion.id}>{occasion.name}</li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default AddOccasion;
