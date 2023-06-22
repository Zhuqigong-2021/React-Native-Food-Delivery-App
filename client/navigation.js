import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Stack = createNativeStackNavigator();
import HomeScreen from "./screens/HomeScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import CartScreen from "./screens/CartScreen";
import OrderPreparingScreen from "./screens/OrderPreparingScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import SearchScreen from "./screens/SearchScreen";
import AccountScreen from "./screens/AccountScreen";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import OrderScreen from "./screens/OrderScreen";
import "react-native-url-polyfill/auto";

import Ionicons from "react-native-vector-icons/Ionicons";

import React from "react";
import FavouriteScreen from "./screens/FavouriteScreen";
import DishDetail from "./components/DishDetail";

//screen name
const homeName = "Home";
const searchName = "Search";
const cartName = "Cart";
const accountName = "Account";
const Tab = createBottomTabNavigator();

export const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      className="bg-green-500"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn == homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn == searchName) {
            iconName = focused ? "search" : "search-outline";
          } else if (rn == cartName) {
            iconName = focused ? "cart" : "cart-outline";
          } else if (rn == accountName) {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,

        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: {
          paddingBottom: 10,
          fontSize: 10,
          fontWeight: 800,
        },
        tabBarStyle: { padding: 5, height: 60 },
      })}
    >
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={searchName} component={SearchScreen} />
      <Tab.Screen name={cartName} component={CartScreen} />
      <Tab.Screen name={accountName} component={AccountScreen} />
    </Tab.Navigator>
  );
};
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        <Stack.Screen name="homeName" component={HomeScreen} />
        <Stack.Screen name="RestuanrantTab" component={BottomTab} />
        <Stack.Screen name="Restaurant" component={RestaurantScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen
          name="cartName"
          // options={{ presentation: "modal" }}
          // options={{ presentation: "modal" }}
          component={CartScreen}
        />
        <Stack.Screen
          name="OrderPreparing"
          options={{ presentation: "fullScreenModal" }}
          component={OrderPreparingScreen}
        />
        <Stack.Screen
          name="Delivery"
          options={{ presentation: "fullScreenModal" }}
          component={DeliveryScreen}
        />
        <Stack.Screen name="BottomTab" component={BottomTab} />

        {/* Weiguang added */}
        <Stack.Screen name="Favourite" component={FavouriteScreen} />
        <Stack.Screen name="DishDetail" component={DishDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
