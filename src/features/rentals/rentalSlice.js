import { createSlice } from "@reduxjs/toolkit";
import rentalListing from "../../data/rentalListing.json";

const rentalSlice = createSlice({
  name: "rentals",
  initialState: {
    rentals: rentalListing,
  },
  reducers: {
    createRental: (state, action) => {
      state.rentals.push(action.payload);
    },
    updateRental: (state, action) => {
      const { id, updatedRental } = action.payload;
      const index = state.rentals.findIndex((rental) => rental.id === id);
      if (index !== -1) {
        state.rentals[index] = { ...state.rental[index], ...updatedRental };
      }
    },
    deleteRental: (state, action) => {
      const id = action.payload;
      state.rentals = state.rentals.filter((rental) => rental.id !== id);
    },
    setRentals: (state, action) => {
      state.rentals = action.payload;
    },
  },
});

export const { createRental, updateRental, deleteRental, setRentals } =
  rentalSlice.actions;

export default rentalSlice.reducer;
