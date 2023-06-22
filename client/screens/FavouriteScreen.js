import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { db } from "../FirebaseConfig";

import { useState } from "react";
import FavouriteDishRow from "../components/favoriteDishRow";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Icon from "react-native-feather";
import { customedTheme } from "../theme";
import { useRoute, useNavigation } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
export default function FavouriteScreen() {
  const { currentUser } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const { theme } = useSelector((state) => state.theme);
  const [favDishes, setFavDishes] = useState([]);

  useEffect(() => {
    const docRef = doc(db, "LikedDishes", `${currentUser?.uid}`);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      // console.log(
      //   snapshot?.data()?.likedDishes?.map((dish) => {
      //     if (dish.dish_Id == item._id) {
      //       setLiked(true);
      //     }
      //   console.log(snapshot?.data()?.likedDishes || []);
      setFavDishes(snapshot?.data()?.likedDishes || []);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* <View className=" bg-white "> */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute top-10 left-4 bg-gray-50 p-2 rounded-full shadow  z-10"
      >
        <Icon.ArrowLeft
          strokeWidth={3}
          stroke={customedTheme(theme).bgColor(1)}
        />
      </TouchableOpacity>
      <SafeAreaView>
        <Text className="px-4 py-10 text-2xl top-5 font-bold text-center">
          My favourite
        </Text>
        {/* dishes */}
        {/* <Text>{favDishes.map((doc) => console.log(doc))}</Text> */}
      </SafeAreaView>
      <ScrollView className="flex-1  ">
        <View className=" justify-center items-center  ">
          {favDishes.length ? (
            favDishes?.map((doc, index) => (
              <FavouriteDishRow key={index} dish={{ ...doc }} />
            ))
          ) : (
            <View className="flex-col items-center justify-center  mt-36">
              <Image
                source={require("../assets/images/heart.png")}
                className="h-40 w-40"
              />
              <Text className="text-center font-bold text-lg mt-10 max-w-[200px] ">
                Add your favourite dish now
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                className="px-4 py-2 bg-black rounded-full mt-4"
              >
                <Text className="text-white">Get Started</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      {/* </View> */}
    </View>
  );
}
