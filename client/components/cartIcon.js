import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { selectCartItems, selectCartTotal } from "../slices/cartSlice";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import { emptyCart } from "../slices/cartSlice";
export default function CartIcon() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { theme } = useSelector((state) => state.theme);
  if (!cartItems.length) return;

  return (
    <View className="absolute bottom-5 w-full z-50">
      <TouchableOpacity
        onPress={() => navigation.navigate("Cart")}
        style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
        className="flex-row justify-between items-center mx-5 rounded-full p-4 py-3 shadow-lg"
      >
        <View
          className="p-2 px-4 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
        >
          <Text className="font-extrabold text-white text-lg">
            {cartItems.length}
          </Text>
        </View>
        <Text className="flex-1 text-center font-extrabold text-white text-lg">
          View Cart
        </Text>
        <Text className="font-extrabold text-white text-lg">
          ${cartTotal.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
