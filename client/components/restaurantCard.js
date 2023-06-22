import { View, Text, TouchableWithoutFeedback, Image } from "react-native";
import React from "react";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { urlFor } from "../sanity";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function RestaurantCard({ item }) {
  const navigation = useNavigation();
  const { theme } = useSelector((state) => state.theme);

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("Restaurant", { ...item })}
    >
      <View
        style={{
          shadowColor: customedTheme(theme).bgColor(2),
          shadowRadius: 7,
        }}
        className="mr-6 bg-white w-60 rounded-3xl shadow-xl mb-8 mt-4"
      >
        {/* { uri: urlFor(item.image).url() } */}
        <Image
          className="h-20 w-60 rounded-t-3xl"
          source={{ uri: urlFor(item.image).url() }}
        />
        <View className="px-3 pb-4 space-y-2">
          <View className="flex-row justify-between items-center pt-2">
            <Text className="text-lg font-bold ">{item.name}</Text>
            <MaterialCommunityIcons
              name={"heart-outline"}
              size={24}
              color={"black"}
            />
          </View>

          <View className="flex-row items-center space-x-1">
            <Image
              source={require("../assets/images/fullStar.png")}
              className="h-4 w-4"
            />
            <Text className="text-xs">
              <Text className="text-green-700">{item.stars}</Text>
              <Text className="text-gray-700">
                ({item.reviews} review).
                <Text className="font-semibold">{item.category}</Text>{" "}
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
      </View>
    </TouchableWithoutFeedback>
  );
}

//  <View className="flex-row items-center space-x-1">
//             <Image
//               source={require("../assets/images/fullStar.png")}
//               className="h-4 w-4"
//             />
//             <Text className="text-xs">
//               <Text className="text-green-700">{item.stars}</Text>
//               <Text className="text-gray-700">
//                 ({item.reviews} review).
//                 <Text className="font-semibold">{item.category}</Text>{" "}
//               </Text>
//             </Text>
//           </View>

//           <View className="flex-row items-center space-x-1">
//             <Icon.MapPin color="gray" width={15} height={15} />
//             <Text className="text-gray-700 text-xs">
//               {" "}
//               Nearby · {item.address}
//             </Text>
//                   </View>
