import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { urlFor } from "../sanity";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import * as Icon from "react-native-feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getRestByDishRev, getAllRestaurants } from "../api";

import { db, addLike, cancelLike } from "../FirebaseConfig";
import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export default function DishDetail() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [liked, setLiked] = useState(false);
  // const [FoundRestaurant, setFoundRestaurant] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);

  let item = params;
  console.log(item);

  //add like
  console.log(currentUser);
  const customerDocID = item._id + currentUser.uid;

  useEffect(() => {
    getAllRestaurants().then((data) => setAllRestaurants(data));
  }, []);
  let filteredRes;
  const FoundRestaurant = allRestaurants.map((res) =>
    res.dishes.map((dish) => {
      if (dish._id == item._id) {
        filteredRes = res;
      }
    })
  );

  const likedDish = {
    restaurantName: filteredRes?.name,
    restaurantID: filteredRes?._id,
    dish_Name: item.name,
    dish_Id: item._id,
    dish_img: item.image,
    dish_price: item.price,
    dish_des: item.description,
    user: currentUser.email,
    // userId: currentUser._id,
  };

  //   // Weiguang add Like button:
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

  return (
    <View>
      <View className="relative">
        <TouchableOpacity
          onPress={() => navigation.navigate("Restaurant", { ...filteredRes })}
        >
          <Image
            className="w-full h-72"
            source={{ uri: urlFor(item.image).url() }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-10 left-4 bg-gray-50 p-2 rounded-full shadow  z-10"
        >
          <Icon.ArrowLeft
            strokeWidth={3}
            stroke={customedTheme(theme).bgColor(1)}
          />
        </TouchableOpacity>
        <Pressable
          onPress={handlePress}
          className="absolute top-10 right-4 bg-gray-50 p-2 rounded-full shadow  z-10"
        >
          <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={liked ? "red" : "black"}
          />
        </Pressable>
      </View>
      <View
        style={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
        className="bg-white -mt-10 pt-6"
      >
        <View className="px-3 pb-4 space-y-2">
          <Text className="text-3xl font-bold pt-2">{item.name}</Text>

          <View className="flex-row items-center space-x-1">
            <Text className="text-xl font-bold pt-2 italic text-slate-600">
              ${item.price}
            </Text>
          </View>
          <View>
            <Text className="font-bold text-lg pt-2">Description:</Text>
          </View>
          <View>
            <Text className="font-semibold"> {item.description}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
