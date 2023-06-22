import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { themeColors } from "../theme";
import RestaurantCard from "./restaurantCard";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
export default function FeatureRow({ title, description, restaurants }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <View>
      <View className="flex-row justify-between items-center px-4 ">
        <View>
          <Text className="font-bold text-lg">{title}</Text>
          <Text className="text-gray-500 text-xs">{description}</Text>
        </View>

        <TouchableOpacity>
          <Text
            style={{ color: customedTheme(theme).text }}
            className="font-semibold"
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        className="overflow-visible py-0"
      >
        {restaurants.map((restaurant) => {
          return (
            <RestaurantCard
              key={restaurant._id}
              id={restaurant._id}
              imgUrl={restaurant.image}
              title={restaurant.name}
              rating={restaurant.rating}
              type={restaurant.type?.name}
              address="123 main street"
              description={restaurant.description}
              dishes={restaurant.dishes}
              lng={restaurant.lng}
              lat={restaurant.lat}
              item={restaurant}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
