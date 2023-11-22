import axios from "axios";

export const addOccasionAPI = async (ocassionData) => {
  try {
    const ocassions = await axios.post(
      "http://localhost:3001/api/v1/occasion/addOcassion",
      ocassionData
    );
    console.log(ocassions);
    return ocassions;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export async function FetchAllOcassions() {
  try {
    const response = await axios.get("http://localhost:3001/api/v1/Occasion");
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.occasions)
    ) {
      const occasions = response.data.data.occasions;
      console.log("Fetched occasions:", occasions);
      return occasions;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Error fetching occasions:", error);
    throw error;
  }
}
