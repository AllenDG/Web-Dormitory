import { configureStore } from "@reduxjs/toolkit";
import rentalReducer from "./rentals/rentalSlice";

const store = configureStore({
  reducer: {
    rentals: rentalReducer,
  },
});

export default store;
