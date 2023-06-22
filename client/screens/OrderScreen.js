import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { customedTheme } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { readOrderData } from "../FirebaseConfig";
import { setOrder } from "../slices/orderSlice";
import OrderCard from "../components/orderCard";
import * as Icon from "react-native-feather";
import { onSnapshot } from "firebase/firestore";
import { collection, doc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

const OrderScreen = () => {
  const navigation = useNavigation();
  const { theme } = useSelector((state) => state.theme);
  const { order } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.user);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // const ordersRef = orderCollectionRef(order);
    const ordersRef = doc(db, "orders", `${currentUser.uid}`);

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      setOrders(snapshot.data()?.orders || []);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <TouchableOpacity
        // onPress={() => navigation.navigate("Home")}
        onPress={() => navigation.navigate("Account")}
        className="absolute top-10 left-4 bg-gray-50 p-2 rounded-full shadow  z-10"
      >
        <Icon.ArrowLeft
          strokeWidth={3}
          stroke={customedTheme(theme).bgColor(1)}
        />
      </TouchableOpacity>
      {orders?.length ? (
        <Text className="font-bold text-lg mt-20 ml-6 mb-6">Order History</Text>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        className=" overflow-hidden"
      >
        {orders?.length ? (
          <View className="z-10">
            {orders?.reverse().map((eachOrder, i) => (
              <View className="mb-4 px-6" key={i}>
                <OrderCard item={eachOrder} />
              </View>
            ))}
          </View>
        ) : (
          <View className="z-10  items-center w-full mt-48">
            <Image
              source={require("../assets/images/bikeGuy.png")}
              className="w-40 h-40 rounded-full"
            />
            <Text className="font-bold text-lg">Let's take an order now</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              className="px-4 py-2 bg-black mt-4 rounded-full"
            >
              <Text className="text-white ">Order now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderScreen;
