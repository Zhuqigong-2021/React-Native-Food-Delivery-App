import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";

import { urlFor } from "../sanity";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getRestById } from "../api";
import { useNavigation } from "@react-navigation/native";
import { db, addLike, cancelLike } from "../FirebaseConfig";
import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export default function FavouriteDishRow({ dish }) {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [liked, setLiked] = useState(true);
  const [restaurant, setFoundRestaurant] = useState();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // console.log("Iam here", dish);
  let item = dish;
  useEffect(() => {
    getRestById(dish.restaurantID).then((data) => setFoundRestaurant(data[0]));
  }, []);

  const likedDish = {
    restaurantName: restaurant?.name,
    restaurantID: restaurant?._id,
    dish_Name: item.dish_Name,
    dish_Id: item.dish_Id,
    dish_img: item.dish_img,
    dish_price: item.dish_price,
    dish_des: item.dish_des,
    user: currentUser.email,
    // userId: currentUser._id,
  };
  // Weiguang Like button:
  useEffect(() => {
    const docRef = doc(db, "LikedDishes", `${currentUser?.uid}`);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      console.log(
        snapshot?.data()?.likedDishes?.map((dish) => {
          if (dish.dish_Id == item._id) {
            setLiked(true);
          }
        })
      );
    });
    return () => {
      unsubscribe();
    };
  }, [liked]);

  const deleteDocument = async () => {
    try {
      await cancelLike(currentUser.uid, likedDish);

      setLiked(false);
      console.log(likedDish);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handlePress = () => {
    deleteDocument();
  };

  // ****Weiguang end***
  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("Restaurant", { ...restaurant })}
    >
      <View className="flex-row items-center bg-white p-3 rouned-3xl shadow-2xl mb-3 mx-2">
        <Image
          className="rounded-3xl"
          style={{ height: 100, width: 100 }}
          source={{ uri: urlFor(item.dish_img).url() }}
        />
        <View className="flex flex-1 space-y-3">
          <Pressable
            onPress={handlePress}
            className="absolute top-2 right-4 bg-gray-50 p-2 rounded-full shadow  z-10"
          >
            <MaterialCommunityIcons
              name={liked ? "heart" : "heart-outline"}
              size={32}
              color={liked ? "red" : "black"}
            />
          </Pressable>
          <View className="pl-3">
            <Text className="text-xl">{item.dish_Name}</Text>
            <Text className="text-gray-700">{item.dish_des}</Text>
          </View>
          <View className="flex-row justify-between pl-3 items-center">
            <Text className="text-gray-700 text-lg font-bold">
              ${item.dish_price}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between pl-3 items-center">
          <Text className="text-gray-700 text-lg font-bold">
            {/* {FoundRestaurant.name} */}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
