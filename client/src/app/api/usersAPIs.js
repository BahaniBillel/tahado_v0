import axios from "axios";

export const CreateUserAPI = async (userData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/users/createUser",
      userData
    );
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export async function FetchUsersAPI() {
  const response = await axios.get("http://localhost:3001/api/v1/users");
  const users = await response.data.data.users;
  // console.log(gifts);
  return users;
}

export async function MakeUserAdminAPI(userId) {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/v1/users/makeUserAdmin",
      { userId }
    );
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
