import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { getAllRestaurants, getAllDishes } from "../api";
import RestaurantCard from "../components/restaurantCard";

import DishCard from "../components/dishCard";

const SearchScreen = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [filteredDish, setFilterDishes] = useState([]);
  const [text, setText] = useState(null);

  useEffect(() => {
    getAllRestaurants().then((data) => setAllRestaurants(data));
    getAllDishes().then((data) => setDishes(data));
  }, []);
  useEffect(() => {
    setText(text);

    setFilterDishes([
      ...dishes.filter((dish) =>
        dish.name.toLowerCase().includes(text?.toLowerCase())
      ),
    ]);

    setFilteredRestaurants([
      ...allRestaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(text?.toLowerCase())
      ),
    ]);

    if (!text) {
      setFilterDishes(dishes);
      setFilteredRestaurants(allRestaurants);
    }
  }, [text, dishes, allRestaurants]);

  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-row items-center space-x-2 px-4 pb-2">
        <View className="flex-row flex-1 items-center p-3 rounded-full border border-gray-300 mt-2">
          <Icon.Search height="25" width="25" stroke="gray" />
          <TextInput
            placeholder="Resturants | Dishes"
            className="ml-2 flex-1"
            keyboardType="default"
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300">
            <Icon.MapPin height="20" width="20" stroke="gray" />
            <Text className="text-gray-600">Montreal, Canada</Text>
          </View>
        </View>
      </View>
      <ScrollView
        vertical
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 36 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="flex-col justify-center space-x-2 px-4 pb-2 ">
            {text ? (
              filteredRestaurants.length ? (
                <Text className="text-lg font-semibold">
                  Selected Restuarants
                </Text>
              ) : null
            ) : filteredRestaurants.length ? (
              <Text className="text-lg font-semibold">All Restuarants</Text>
            ) : null}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              // contentContainerStyle={{
              //   paddingHorizontal: 15,
              // }}
              className="overflow-visible py-0 w-96 "
            >
              <View className=" flex-row ">
                {/* <View className=" bg-black flex-nowrap"> */}
                {filteredRestaurants.map((restaurant, index) => (
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
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-col justify-center space-x-2 px-4 pb-2 ">
            {text ? (
              filteredDish.length ? (
                <Text className="text-lg font-semibold">Selected Dishes</Text>
              ) : null
            ) : filteredDish.length ? (
              <Text className="text-lg font-semibold">All Dishes</Text>
            ) : null}
            <ScrollView
              showsHorizontalScrollIndicator={false}
              vertical
              contentContainerStyle={{ flexGrow: 1 }}
              // contentContainerStyle={{
              //   paddingHorizontal: 15,
              // }}
              className="overflow-visible py-0 w-96  m-2"
            >
              <View className=" flex-row flex-wrap flex-1 ">
                {filteredDish.map((item) => (
                  <View key={item._id} className="w-1/2  flex-row ">
                    <DishCard
                      key={item._id}
                      id={item._id}
                      item={item}
                      imgUrl={item.image}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
