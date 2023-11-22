import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  likes: [],
  heart: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      const itemExists = state.items.find(
        (item) => item.name === action.payload.name
      );
      if (itemExists) {
        itemExists.quantity;
      } else {
        state.items = [...state.items, { ...action.payload, quantity: 1 }];
      }

      if (typeof window !== "undefined") {
        // Perform localStorage action

        localStorage.setItem("items", JSON.stringify(state.items));
      }
    },
    incrementQuantity: (state, action) => {
      const { name, price } = action.payload;
      const item = state.items.find((item) => item.name === name);

      if (item && item.quantity < item.sku) {
        const prevQuantity = item.quantity;
        item.quantity += 1;
        const priceIncrement = price / prevQuantity;
        item.price += priceIncrement;
      } else {
        return;
      }
    },

    decrementQuantity: (state, action) => {
      const { name, price } = action.payload;
      const item = state.items.find((item) => item.name === name);

      if (item.quantity === 1) {
        const index = state.items.findIndex((item) => item.name === name);
        state.items.splice(index, 1);
      } else {
        item.quantity -= 1;
        item.price -= item.price / (item.quantity + 1); // Update the price
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
} = basketSlice.actions;

// this is  how we pull items from the global store
export const selectItems = (state) => state.basket.items;
export const selectTotal = (state) =>
  state.basket.items.reduce((total, item) => total + parseFloat(item.price), 0);

export const selectLikes = (state) => state.basket.likes;
export const selectHeartState = (state) => state.basket.heart;

export default basketSlice.reducer;

// Notifying the dispatched product
const notify = (productName) => {
  toast(`${productName} was added to basket`, {
    position: toast.POSITION.BOTTOM_RIGHT,
    className: "foo-bar text-xs font-light",
  });
};
