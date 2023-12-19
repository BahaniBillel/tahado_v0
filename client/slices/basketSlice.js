import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  likes: [],
  heart: [],
  lastVisitedUrl: null,
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      const itemExists = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );
      if (itemExists) {
        itemExists.quantity += 1;
      } else {
        state.items = [...state.items, { ...action.payload, quantity: 1 }];
      }

      if (typeof window !== "undefined") {
        // Perform localStorage action

        localStorage.setItem("items", JSON.stringify(state.items));
      }
    },
    // incrementQuantity: (state, action) => {
    //   const { productId, price } = action.payload;
    //   const item = state.items.find((item) => item.product_id === productId);
    //   console.log("from increase quantity:", item.quantity);
    //   if (item && item.quantity) {
    //     const prevQuantity = item.quantity;
    //     item.quantity += 1;
    //     const priceIncrement = price / prevQuantity;
    //     item.price += priceIncrement;
    //   } else {
    //     return;
    //   }
    // },
    incrementQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.items.find((item) => item.product_id === productId);
      if (item) {
        item.quantity += 1;
        item.amount = item.quantity * item.price; // Calculate new amount
      }
    },

    decrementQuantity: (state, action) => {
      const { productId } = action.payload;
      const item = state.items.find((item) => item.product_id === productId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.amount = item.quantity * item.price; // Calculate new amount
      }
    },
    removeFromBasket: (state, action) => {
      // find the item index inside the items basket
      const index = state.items.findIndex(
        (basketItem) => basketItem.name === action.payload.name
      );

      // create a new basket
      let newBasket = [...state.items];

      // implementing the logic

      if (index >= 0) {
        // using splice methode to remove the item from the basket
        // don't use filter because it will remove all the items from the basket
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id :${action.payload.id}) from basket as it doesnt exist.`
        );
      }

      state.items = newBasket;
    },
    resetItems: (state) => {
      state.items = [];
    },

    incrementLikes: (state, action) => {
      state.likes = [...state.likes, action.payload];
    },

    decrementLikes: (state, action) => {
      // find the item index inside the items basket
      const index = state.likes.findIndex(
        (basketItem) => basketItem.giftName === action.payload.giftName
      );

      // create a new basket
      let newLikes = [...state.likes];

      // implementing the logic

      if (index >= 0) {
        // using splice methode to remove the item from the basket
        // don't use filter because it will remove all the items from the basket
        newLikes.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id :${action.payload.giftName}) from basket as it doesnt exist.`
        );
      }

      state.likes = newLikes;
    },

    // Reducer to save the last visited URL
    setLastVisitedUrl: (state, action) => {
      state.lastVisitedUrl = action.payload;
    },

    // Reducer to clear the last visited URL
    clearLastVisitedUrl: (state) => {
      state.lastVisitedUrl = null;
    },
  },
});

export const {
  addToBasket,
  removeFromBasket,
  incrementLikes,
  decrementLikes,
  incrementQuantity,
  decrementQuantity,
  resetItems,
  setLastVisitedUrl,
  clearLastVisitedUrl,
} = basketSlice.actions;

// this is  how we pull items from the global store
export const selectItems = (state) => state.basket.items;
export const selectTotal = (state) =>
  state.basket.items.reduce((total, item) => total + parseFloat(item.price), 0);
// Selector to get the last visited URL from the state
export const selectLastVisitedUrl = (state) => state.basket.lastVisitedUrl;

export const selectLikes = (state) => state.basket.likes;
export const selectHeartState = (state) => state.basket.heart;

export default basketSlice.reducer;
