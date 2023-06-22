import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useRoute, useNavigation } from "@react-navigation/native";
import DishRow from "../components/dishRow";
import CartIcon from "../components/cartIcon";
import { StatusBar } from "expo-status-bar";
import { setRestaurant } from "../slices/restaurantSlice";
import { urlFor } from "../sanity";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import { emptyCart } from "../slices/cartSlice";

export default function RestaurantScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { theme } = useSelector((state) => state.theme);
  let item = params;

  const dispatch = useDispatch();
  useEffect(() => {
    if (item && item._id) {
      dispatch(setRestaurant({ ...item, imgUrl: item.image }));
    }
  }, []);

  useEffect(() => {
    dispatch(emptyCart());
  }, []);

  return (
    <View>
      <CartIcon />
      <StatusBar style="light" />
      <ScrollView>
        <View className="relative">
          <Image
            className="w-full h-72"
            source={{ uri: urlFor(item.image).url() }}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-10 left-4 bg-gray-50 p-2 rounded-full shadow  z-10"
          >
            <Icon.ArrowLeft
              strokeWidth={3}
              stroke={customedTheme(theme).bgColor(1)}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
          className="bg-white -mt-12 pt-6"
        >
          <View className="px-5">
            <Text className="text-3xl font-bold">{item.name}</Text>
            <View className="flex-row space-x-2 my-1">
              <View className="flex-row items-center space-x-1">
                <Image
                  source={require("../assets/images/fullStar.png")}
                  className="h-4 w-4"
                />
                <Text className="text-xs">
                  <Text className="text-green-700 ">{item.stars}</Text>
                  <Text className="text-gray-700">
                    ({item.reviews} review) . &nbsp;
                    <Text className="font-semibold">{item?.type?.name}</Text>
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center space-x-1">
                <Icon.MapPin color="gray" width={15} height={15} />
                <Text className="text-gray-700 text-xs">
                  Nearby · {item.address}
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 mt-2">{item.description}</Text>
          </View>
        </View>
        <View className="pb-36 bg-white">
          <Text className="px-4 py-4 text-2xl font-bold">Menu</Text>
          {/* dishes */}
          {item.dishes.map((dish, index) => (
            <DishRow item={{ ...dish }} key={index} restaurant={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
