import { configureStore } from "@reduxjs/toolkit";

import cartSlice from "./slices/cartSlice";
import restaurantSlice from "./slices/restaurantSlice";
import userSlice from "./slices/userSlice";
import themeSlice from "./slices/themeSlice";
import orderSlice from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    restaurant: restaurantSlice,
    user: userSlice,
    theme: themeSlice,
    order: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
