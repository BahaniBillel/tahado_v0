// slices/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productName) => {
    const response = await axios.post('http://localhost:3001/api/addToWishlist', { productName });
    return response.data;
  }
);

export const updateLike = createAsyncThunk(
  'wishlist/updateLike',
  async ({ id, liked }) => {
    const response = await axios.put('http://localhost:3001/api/updateLike', { id, liked });
    return response.data;
  }
);

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(updateLike.fulfilled, (state, action) => {
      const item = state.find((x) => x.id === action.payload.id);
      if (item) {
        item.liked = action.payload.liked;
      }
    });
  },
});

export default wishlistSlice.reducer;
