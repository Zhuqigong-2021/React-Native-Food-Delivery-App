import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { urlFor } from "../sanity";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { cancelOrderCollection } from "../FirebaseConfig";

const OrderCard = ({ item }) => {
  const navigation = useNavigation();
  const {
    imgUrl,
    restaurant,
    totalItems,
    totalPrice,
    time,
    groupedItems,
    cartItems,
  } = item;
  let cartTotal = totalItems;
  const [timeDif, setTimeDif] = useState(false);
  //calculate the time difference

  function parseDate(dateString) {
    const [datePart, timePart] = dateString.split(", ");

    const [month, day, year] = datePart.split("/");
    const [time, ampm] = timePart.split(" ");

    let [hour, minute, second] = time.split(":");

    if (ampm === "PM") {
      hour = String(Number(hour) + 12);
    }

    return new Date(year, month - 1, day, hour, minute, second);
  }

  const currentTime = new Date();
  const orderDate = parseDate(time);
  useEffect(() => {
    const boolTime =
      Math.abs(currentTime.getTime() - orderDate.getTime()) < 60000;
    setTimeDif(boolTime);
    console.log("bool", boolTime);
  }, [currentTime, orderDate, timeDif]);

  console.log("timeDif", timeDif);
  console.log("order time", time);
  console.log("order", orderDate.getTime());
  console.log("current", currentTime.getTime());
  console.log("timeDif", timeDif);
  console.log(
    "timeDifvalue",
    Math.abs(currentTime.getTime() - orderDate.getTime())
  );
  const handleCancel = async () => {
    alert("You have successfully cancelled an order");

    await cancelOrderCollection(item);
  };

  return (
    <View className="flex-row px-2  py-2 bg-white rounded-lg">
      <View>
        <Image
          className="w-20 h-20 rounded-xl"
          source={{ uri: urlFor(imgUrl).url() }}
        />
      </View>
      <View className=" w-3/4 ml-2 flex-row justify-between">
        <View>
          <Text className="font-bold text-lg">{restaurant.name}</Text>
          <View className="flex-row space-x-1">
            <Text className="">{totalItems} items</Text>
            <Text className="">${totalPrice}</Text>
          </View>

          <Text className="mt-4">{time}</Text>
        </View>
        <View className="flex-row items-center">
          {timeDif ? (
            <TouchableOpacity
              onPress={handleCancel}
              className="bg-green-300 text-white px-6 py-2 rounded-full "
            >
              <Text className="text-black">Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Cart", {
                  groupedItems,
                  cartTotal,
                  cartItems,
                  restaurant,
                })
              }
              className="bg-gray-200 text-white px-5 py-2 rounded-full "
            >
              <Text className="text-black">Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default OrderCard;
