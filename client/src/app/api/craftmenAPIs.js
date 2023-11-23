import axios from "axios";

export const CreateCraftmanAPI = async (craftmanData) => {
  console.log(craftmanData);
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/craftmen/createCraftman",
      craftmanData
    );
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export async function FetchCraftmenAPI() {
  const response = await axios.get("http://localhost:3001/api/v1/craftmen");
  const craftmen = await response.data.data.craftmen;
  // console.log(gifts);
  return craftmen;
}
