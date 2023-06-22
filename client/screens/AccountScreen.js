import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { findTheme, saveTheme, signoutUser } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { themeColors } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { setCurrentTheme } from "../slices/themeSlice";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import { readOrderData } from "../FirebaseConfig";
import { setOrder } from "../slices/orderSlice";
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseConfig";

const AccountScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { currentUser } = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCodeVisible, setModalCodeVisible] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const { order } = useSelector((state) => state.order);
  const [name, setName] = useState("");
  const [orders, setOrders] = useState([]);

  const handleLogout = async () => {
    await signoutUser();
    navigation.navigate("Login");
  };
  const getOrderData = async () => {
    try {
      const data = await readOrderData(currentUser.uid);
      if (data) {
        dispatch(setOrder(data.orders));
      } else {
        dispatch(setOrder([]));
      }
    } catch (error) {
      alert(error.message);
    } finally {
      navigation.navigate("Order");
    }
  };

  const handleSavetheme = async () => {
    await saveTheme(currentUser.uid, theme);
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    // const ordersRef = orderCollectionRef(order);
    const ordersRef = doc(db, "orders", `${currentUser.uid}`);

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      setOrders(snapshot.data()?.orders);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userRef = doc(db, "users", `${currentUser?.uid}`);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      setName(snapshot.data()?.displayName || currentUser?.displayName);
    });
    return () => {
      unsubscribe();
    };
  }, [currentUser, setName, name]);

  useEffect(() => {
    const themeRef = doc(db, "theme", `${currentUser?.uid}`);

    const unsubscribe = onSnapshot(themeRef, (snapshot) => {
      // console.log(snapshot.docs.map((doc) => doc.data()));]
      // console.log(snapshot.data().theme);
      dispatch(setCurrentTheme(snapshot.data()?.theme || 0));
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <SafeAreaView
      className="flex-1  p-4 px-8 "
      style={{
        backgroundColor:
          modalVisible || modalCodeVisible
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(255,255,255,0.5)",
      }}
    >
      <View className=" flex-1 ">
        <View className="border-b-4 mb-10 border-gray-200 pb-4 ">
          <View className="flex-row justify-between items-center py-4  ">
            <View>
              <Text className="font-bold text-4xl scale-y-90  ">
                {/* {currentUser?.displayName} */}
                {name}
              </Text>
            </View>
            <FontAwesome
              name="user-circle-o"
              size={48}
              color="rgba(0,0,0,0.5)"
            />
          </View>
          <View className="flex-row justify-between ">
            <View className="flex-col items-center">
              <TouchableOpacity
                onPress={() => navigation.navigate("Favourite")}
                className="bg-red-200 px-8 py-2 -z-10 rounded-l-xl flex items-center justify-center opacity-75"
              >
                <View className="  ">
                  <Ionicons name="ios-heart" size={48} color="red" />
                </View>
              </TouchableOpacity>
              <Text className="mt-4 font-semibold">Favourites</Text>
            </View>
            <View className="flex-col items-center">
              <TouchableOpacity className="bg-blue-200 px-8 py-2 -z-10  flex items-center justify-center opacity-75">
                <View className="relative">
                  <Ionicons name="ios-wallet" size={48} color="#3b82f6" />
                  <View className="absolute -bottom-0 -right-1  p-1 scale-95 rounded-full bg-[#3b82f6] flex-row text-center border-2 border-white justify-center items-center ">
                    <Text className="text-white  h-4 w-4 text-center text-sm ">
                      {orders?.length || 0}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <Text className="mt-4 font-semibold">Points</Text>
            </View>
            <View className="flex-col items-center">
              <TouchableOpacity
                onPress={getOrderData}
                className="bg-emerald-200 px-8 py-2 -z-10 rounded-r-xl flex items-center justify-center opacity-75"
              >
                <View>
                  <Ionicons
                    name="md-fast-food-sharp"
                    size={48}
                    color="#22c55e"
                  />
                </View>
              </TouchableOpacity>
              <Text className="mt-4 font-semibold">Orders</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1 space-y-10"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center space-x-6">
            <Ionicons name="color-palette" size={20} color="black" />
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View className="flex-col flex-1 justify-center items-center">
                <View className="flex-col p-10 px-20 rounded-2xl m-5 justify-center items-center bg-white">
                  <Text className="text-black font-semibold text-lg mb-4">
                    Theme
                  </Text>
                  <SafeAreaView className="flex-row space-x-4 mt-4">
                    <TouchableOpacity
                      onPress={() => dispatch(setCurrentTheme(0))}
                      className="bg-[#f97316]  h-3 w-3 rounded-full opacity-60"
                    ></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => dispatch(setCurrentTheme(1))}
                      className="bg-[#334155] h-3 w-3 rounded-full opacity-60"
                    ></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => dispatch(setCurrentTheme(2))}
                      className="bg-[#7c3aed] h-3 w-3 rounded-full opacity-60"
                    ></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => dispatch(setCurrentTheme(3))}
                      className="bg-[#009950] h-3 w-3 rounded-full opacity-60"
                    ></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => dispatch(setCurrentTheme(4))}
                      className="bg-[#14b8a6] h-3 w-3 rounded-full opacity-60"
                    ></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => dispatch(setCurrentTheme(5))}
                      className="bg-[#dc2626] h-3 w-3 rounded-full opacity-60"
                    ></TouchableOpacity>
                  </SafeAreaView>
                  <Pressable className="mt-10 " onPress={handleSavetheme}>
                    <Text
                      style={{
                        backgroundColor: customedTheme(theme).bgColor(1),
                      }}
                      className="  p-2 px-4 text-white font-bold rounded-full "
                    >
                      Save
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text className="font-bold">Theme</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center space-x-6">
            <Ionicons name="person-add-sharp" size={20} color="black" />
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalCodeVisible}
              onRequestClose={() => {
                setModalCodeVisible(!modalCodeVisible);
              }}
            >
              <View className="flex-col flex-1 justify-center items-center">
                <View className="flex-col p-10 px-8 rounded-2xl m-5 justify-center items-center bg-white overflow-hidden">
                  <View
                    className=" absolute top-0 left-0 right-0 flex-row justify-center items-center py-4 "
                    style={{
                      backgroundColor: customedTheme(theme).bgColor(0.3),
                    }}
                  >
                    <Image
                      source={require("../assets/images/food.png")}
                      className="h-28 w-28 "
                    />
                    {/* <Text>OK</Text> */}
                  </View>
                  <Text className="text-gray-500 font-semibold text-lg mb-4 scale-y-90 mt-28">
                    YOUR CODE
                  </Text>
                  <View
                    className="p-2  border-2 border-dashed"
                    style={{
                      borderColor: customedTheme(theme).bgColor(1),
                    }}
                  >
                    <Text
                      className="text-xl "
                      style={{
                        color: customedTheme(theme).bgColor(1),
                      }}
                    >
                      eats-dyalilay2uue
                    </Text>
                  </View>
                  <SafeAreaView className="flex-row  my-4  ">
                    <Text className="text-[18px] text-gray-500">
                      Share your code with a friend,When they use it, You both
                      got $20 off
                    </Text>
                  </SafeAreaView>
                  <Pressable
                    className="mt-10 rounded-full absolute bottom-2 right-2"
                    // style={{
                    //   backgroundColor: customedTheme(theme).bgColor(1),
                    // }}
                    onPress={() => setModalCodeVisible(false)}
                  >
                    {/* <Text className=" h-4 w-4 text-white font-bold text-center ">
                      x
                    </Text> */}
                    <Ionicons
                      name="close-circle"
                      size={24}
                      style={{
                        color: customedTheme(theme).bgColor(1),
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Pressable onPress={() => setModalCodeVisible(true)}>
              <Text className="font-semibold">Invite friends</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center space-x-6">
            <Ionicons name="pricetag-sharp" size={20} color="black" />

            <Text className="font-semibold">Promotions</Text>
          </View>

          <View className="flex-row items-center space-x-6">
            <Ionicons name="information-circle" size={20} color="black" />

            <Text className="font-semibold">About</Text>
          </View>

          {/* <View className="flex-row items-center space-x-6">
            <FontAwesome name="dollar" size={18} color="black" />

            <Text className="font-semibold">Earn by ording</Text>
          </View> */}

          <View className="flex-row items-center space-x-6">
            <Ionicons name="help-circle" size={21} color="black" />

            <Text className="font-semibold">Help</Text>
          </View>

          <View className="flex-row items-center space-x-6">
            <Ionicons
              name="ios-shield-checkmark-sharp"
              size={20}
              color="black"
            />

            <Text className="font-semibold">Covid-19 Safety Guidance</Text>
          </View>

          <View className="flex-row items-center space-x-6">
            <Ionicons name="eye-off-sharp" size={20} color="black" />

            <Text className="font-semibold">Privacy</Text>
          </View>
        </ScrollView>
      </View>
      <View>
        {currentUser ? (
          <TouchableOpacity
            onPress={handleLogout}
            className="py-2 rounded-full"
            style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
          >
            <Text className="text-white text-center font-bold text-lg">
              Log out
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="py-2 rounded-full"
            style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
          >
            <Text className="text-white text-center font-bold text-lg">
              Log in
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
