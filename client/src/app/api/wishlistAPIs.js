import axios from "axios";

export async function PostWishlist(user_id, product_id) {
  const wishlistData = { user_id, product_id };
  try {
    const responsewishlist = await axios.post(
      "http://localhost:3001/api/v1/wishlist/wish",
      wishlistData
    );
    return responsewishlist;
  } catch (error) {
    console.log(error);
  }
}

export async function RemoveWishlist(wishlist_id, product_id, user_id) {
  const wishlistData = { wishlist_id, user_id, product_id };
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/wishlist/unwish",
      wishlistData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function GetAllWishlist() {
  try {
    const response = await axios.get("http://localhost:3001/api/v1/wishlist");
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
