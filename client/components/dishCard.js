import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { urlFor } from "../sanity";
import { customedTheme } from "../theme";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const DishCard = ({ item }) => {
  const { theme } = useSelector((state) => state.theme);
  const navigation = useNavigation();
  return (
    <View
      style={{
        shadowColor: customedTheme(theme).bgColor(2),
        shadowRadius: 7,
      }}
      className=" bg-white w-44 rounded-3xl shadow-xl mb-8 mt-4  mx-auto"
    >
      <TouchableOpacity
        // weiguang add
        onPress={() => navigation.navigate("DishDetail", { ...item })}
      >
        <Image
          className="h-24 w-full rounded-t-3xl"
          source={{ uri: urlFor(item?.image).url() }}
        />
      </TouchableOpacity>

      <Text className="font-bold py-2 text-center">{item?.name}</Text>
    </View>
  );
};

export default DishCard;
