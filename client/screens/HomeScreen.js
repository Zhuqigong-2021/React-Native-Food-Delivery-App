import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import Categories from "../components/categories";

import FeatureRow from "../components/featureRow";
import { getFeaturedRestaurants } from "../api";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";

export default function HomeScreen() {
  const { theme } = useSelector((state) => state.theme);

  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  useEffect(() => {
    getFeaturedRestaurants().then((data) => setFeaturedRestaurants(data));
  }, []);

  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle="dark-content" />
      {/* search bar */}
      <View className="flex-row items-center space-x-2 px-4 pb-2">
        <View className="flex-row flex-1 items-center p-3 rounded-full border border-gray-300 mt-2">
          <Icon.Search height="25" width="25" stroke="gray" />
          <TextInput
            placeholder="Resturants"
            className="ml-2 flex-1"
            keyboardType="default"
          />
          <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300">
            <Icon.MapPin height="20" width="20" stroke="gray" />
            <Text className="text-gray-600">Montreal, Canada</Text>
          </View>
        </View>

        <View
          style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
          className="p-3 rounded-full"
        >
          <Icon.Sliders
            height={20}
            width={20}
            strokeWidth="2.5"
            stroke="white"
          />
        </View>
      </View>
      {/* main */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* categories */}
        <Categories />
        {/* featured */}
        <View className="mt-4">
          {featuredRestaurants.map((item, index) => {
            return (
              <FeatureRow
                key={index}
                title={item.name}
                restaurants={item.restaurants}
                description={item.description}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
