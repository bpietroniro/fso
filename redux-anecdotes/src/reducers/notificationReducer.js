import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notificationChange(state, action) {
      return action.payload;
    },
    clearNotification() {
      return "";
    },
  },
});

export const { notificationChange, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message, duration) => {
  return async (dispatch) => {
    dispatch(notificationChange(message));
    setTimeout(() => dispatch(clearNotification()), duration * 1000);
  };
};

export default notificationSlice.reducer;
