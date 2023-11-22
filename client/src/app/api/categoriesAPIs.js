import axios from "axios";

export const addCategoryAPI = async (categoryData) => {
  try {
    const categories = await axios.post(
      "http://localhost:3001/api/v1/categories/addCategory",
      categoryData
    );
    return categories;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export async function FetchAllCategories() {
  try {
    const response = await axios.get("http://localhost:3001/api/v1/categories");
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.categories)
    ) {
      const categories = response.data.data.categories;
      console.log("Fetched categories:", categories);
      return categories;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
