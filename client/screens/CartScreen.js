import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { featured } from "../constants";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { selectRestaurant, setRestaurant } from "../slices/restaurantSlice";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  setCartItems,
} from "../slices/cartSlice";
import { urlFor } from "../sanity";
import { customedTheme } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import { addOrdersCollection } from "../FirebaseConfig";
import { useStripe } from "@stripe/stripe-react-native";

export default function CartScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const restaurant = useSelector(selectRestaurant);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { theme } = useSelector((state) => state.theme);
  const [groupedItems, setGroupedItems] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const deliveryFee = 2;
  const totalAmount = (cartTotal + deliveryFee).toFixed(2);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  console.log("cart", params);
  useEffect(() => {
    if (params) {
      dispatch(setCartItems(params?.cartItems));
      dispatch(setRestaurant(params?.restaurant));
    }

    console.log("cartItems", cartItems);
  }, [params]);
  const initializePaymentSheet = async () => {
    try {
      const response = await fetch("http://localhost:8080/pay", {
        method: "POST",
        body: JSON.stringify({ name: "phil", totalAmount }),
        headers: { "Content-Type": "application/json" },
      });
      const { paymentIntent } = await response.json();

      console.log("client secret:", paymentIntent);

      if (!response.ok) return Alert.alert("payment data fetched failed");

      // const clientSecret = data.paymentIntent;
      const initSheet = await initPaymentSheet({
        // paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "phil",
        // customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // customerId: customer,
      });

      // if (initSheet.error) return Alert.alert(initSheet.error.message);
      if (initSheet.error) {
        console.log(initSheet.error);
        Alert.alert("something went wrong with initSheet ");
        return;
      }
      // await presentPaymentSheet();
      const presentSheet = await presentPaymentSheet({
        paymentIntent,
      });
      if (presentSheet.error) {
        Alert.alert("Notice", presentSheet.error.message);
        return;
      } else {
        Alert.alert("Ok", "Payment complete,thank you");
        navigation.navigate("OrderPreparing");
        takeOrder();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Something wrong I don't know what happened");
    }
  };

  useEffect(() => {
    const items = cartItems.reduce((group, item) => {
      if (group[item._id]) {
        group[item._id].push(item);
      } else {
        group[item._id] = [item];
      }
      return group;
    }, {});
    setGroupedItems(items);
  }, [cartItems]);

  const takeOrder = async () => {
    if (currentUser) {
      const order = {
        user: currentUser.uid,

        restaurant: restaurant,

        totalItems: cartItems.length,

        totalPrice: (cartTotal + deliveryFee).toFixed(2),

        imgUrl: restaurant.imgUrl,

        groupedItems: groupedItems,
        cartItems: cartItems,

        time: new Date().toLocaleString(),
      };
      await addOrdersCollection(order);
      navigation.navigate("OrderPreparing");
    }
  };

  const handleOrder = () => {
    // initializePaymentSheet();
    takeOrder();
  };

  console.log(restaurant);
  return (
    <ScrollView className="flex-1">
      {cartTotal != 0 ? (
        <View className="bg-white flex-1 h-[100vh]">
          {/* back button */}
          <View className="relative py-4 shadow-sm">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
              className="absolute z-10 rounded-full p-1 shadow top-5 left-2"
            >
              <Icon.ArrowLeft strokeWidth={3} stroke="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-center font-bold text-xl">Your cart</Text>
              <Text className="text-center text-gray-500">
                {/* {params?.restaurant || restaurant?.name} */}
                {restaurant?.name}
              </Text>
            </View>
          </View>
          {/* delivery time */}
          <View
            style={{ backgroundColor: customedTheme(theme).bgColor(0.3) }}
            className="flex-row px-4 items-center"
          >
            <Image
              source={require("../assets/images/bikeGuy.png")}
              className="w-20 h-20 rounded-full"
            />
            <Text className="flex-1 pl-4">Deliver in 20-30 minutes</Text>
            <TouchableOpacity>
              <Text
                className="font-bold"
                style={{ color: customedTheme(theme).text }}
              >
                Change
              </Text>
            </TouchableOpacity>
          </View>
          {/* dish */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 50,
            }}
            className="bg-gray-100 pt-5"
          >
            {Object.entries(groupedItems).map(([key, items]) => {
              let dish = items[0];

              return (
                <View
                  key={key}
                  className="flex-row items-center space-x-3 py-2 px-4 bg-white  rounded-3xl mx-2 mb-3  shadow-md"
                >
                  <Text
                    className="font-bold"
                    style={{ color: customedTheme(theme).text }}
                  >
                    {items.length} x
                  </Text>
                  <Image
                    className="h-14 w-14 rounded-full"
                    source={{ uri: urlFor(dish.image).url() }}
                  />
                  <Text className="flex-1 font-bold text-gray-700">
                    {dish?.name}
                  </Text>
                  <Text className="font-semibold text-base">
                    ${dish?.price}
                  </Text>
                  <TouchableOpacity
                    onPress={() => dispatch(removeFromCart({ id: dish._id }))}
                    className="p-1 rounded-full"
                    style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
                  >
                    <Icon.Minus
                      strokeWidth={2}
                      height={20}
                      width={20}
                      stroke="white"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
          {/* total */}
          <View
            style={{ backgroundColor: customedTheme(theme).bgColor(0.3) }}
            className="p-6 px-8 rounded-t-3xl space-y-4 absolute w-full bottom-16"
          >
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Subtotal</Text>
              <Text className="text-gray-700">${cartTotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Delivery Fee</Text>
              <Text className="text-gray-700">${deliveryFee}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700 font-extrabold ">Order Total</Text>
              <Text className="text-gray-700 font-extrabold">
                ${(cartTotal + deliveryFee).toFixed(2)}
              </Text>
            </View>

            <View>
              <TouchableOpacity
                onPress={handleOrder}
                style={{ backgroundColor: customedTheme(theme).bgColor(1) }}
                className="p-3 rounded-full"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Place Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View className="relative h-[100vh]">
          <Text className="text-center font-bold text-3xl absolute top-24 left-5 text-black z-10">
            Carts
          </Text>

          <View className=" flex-1 bg-white  justify-center items-center  ">
            <Image
              source={require("../assets/images/shopping-cart.jpg")}
              className="h-48 w-56 bg-black relative right-4"
            />
            <Text className=" font-bold text-center text-xl scale-y-95">
              Add items to start a cart
            </Text>
            <Text className="my-5 max-w-[260px] text-center tracking-wider ">
              Once you add items from a restaurant, you cart will appear here
            </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              // style={{ backgroundColor: themeColors.bgColor(1) }}
              className="text-center p-2 px-4 text-white bg-black rounded-full"
            >
              <Text className="text-center  text-white  rounded-full">
                Start shopping
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
