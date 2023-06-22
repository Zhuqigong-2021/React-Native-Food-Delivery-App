import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  addToCart,
  removeFromCart,
  selectCartItemsById,
} from "../slices/cartSlice";
import { urlFor } from "../sanity";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import { db, addLike, cancelLike } from "../FirebaseConfig";
import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export default function DishRow({ item, restaurant }) {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const totalItems = useSelector((state) =>
    selectCartItemsById(state, item._id)
  );

  const likedDish = {
    restaurantName: restaurant.name,
    restaurantID: restaurant._id,
    dish_Name: item.name,
    dish_Id: item._id,
    dish_img: item.image,
    dish_price: item.price,
    dish_des: item.description,
    user: currentUser.email,
    // userId: currentUser._id,
  };
  const handleIncrease = () => {
    if (!currentUser) {
      alert("you are not logged in");
      return;
    }
    dispatch(addToCart({ ...item }));
  };
  const handleDecrease = () => {
    if (!currentUser) {
      alert("you are not logged in");
      return;
    }
    dispatch(removeFromCart({ id: item._id }));
  };

  // Weiguang add Like button:
  // const customerDocID = item._id + currentUser.uid;

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

  const handleAddLike = async () => {
    try {
      if (!currentUser) {
        alert("you are not logged in");
        return;
      }
      await addLike(currentUser.uid, likedDish);

      setLiked(true);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const deleteDocument = async () => {
    try {
      await cancelLike(currentUser.uid, likedDish);

      setLiked(false);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handlePress = () => {
    liked ? deleteDocument() : handleAddLike();
  };

  // ****Weiguang end***

  return (
    <View className="flex-row items-center bg-white p-3 rouned-3xl shadow-2xl mb-3 mx-2">
      <Image
        className="rounded-3xl"
        style={{ height: 100, width: 100 }}
        source={{ uri: urlFor(item.image).url() }}
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
          <Text className="text-xl">{item.name}</Text>
          <Text className="text-gray-700">{item.description}</Text>
        </View>
        <View className="flex-row justify-between pl-3 items-center">
          <Text className="text-gray-700 text-lg font-bold">${item.price}</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleDecrease}
              className="p-1 rounded-full"
              style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
              disabled={!totalItems.length}
            >
              <Icon.Minus
                strokeWidth={2}
                height={20}
                width={20}
                stroke={"white"}
              />
            </TouchableOpacity>
            <Text className="px-3">{totalItems.length}</Text>
            <TouchableOpacity
              onPress={handleIncrease}
              className="p-1 rounded-full"
              style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
            >
              <Icon.Plus
                strokeWidth={2}
                height={20}
                width={20}
                stroke={"white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
