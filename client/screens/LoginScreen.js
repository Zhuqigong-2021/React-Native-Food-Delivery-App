import {
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInUserWithEmailAndPassword } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { onAuthStateChangedListener } from "../FirebaseConfig";
import { setCurrentUser } from "../slices/userSlice";
import { Entypo } from "@expo/vector-icons";
import { createUserDocFromAuth } from "../FirebaseConfig";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocFromAuth(user);
        // const displayName = user.displayName;
        navigation.replace("BottomTab");
      }

      dispatch(setCurrentUser(user));
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("email or password can not be empty");
      return;
    }
    try {
      const user = await signInUserWithEmailAndPassword(email, password);

      navigation.navigate("BottomTab");
      // navigation.navigate("");
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          alert("please input the right password");
          break;
        case "auth/user-not-found":
          alert("no user asscoiated with this email");
          break;
        default:
          alert(error.message);
      }
    }
  };
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#877dfa" }}>
      <SafeAreaView className="flex m-2 ">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl m-4 shadow-xl shadow-slate-950"
          >
            <Entypo name="arrow-bold-left" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center p-2 scale-90">
          <Image
            source={require("../assets/images/rider1.png")}
            style={{ width: 255, height: 200 }}
          />
        </View>
      </SafeAreaView>

      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white px-8  justify-center"
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-2">Email Address</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Email@gmail.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Text className="text-gray-700 ml-2">Password</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl"
            secureTextEntry
            placeholder="*********"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity className="flex items-end">
            <Text className="text-gray-700 mb-5">Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogin}
            className="py-2  bg-yellow-400 rounded-xl"
          >
            <Text className="text-lg font-bold text-center text-gray-700">
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-700 font-semibold  text-center py-5">
          Follow us
        </Text>
        <View className="flex-row justify-center space-x-12">
          <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl flex-row justify-center items-center">
            <Image
              source={require("../assets/images/fab.png")}
              className="w-9 h-9"
            />
          </TouchableOpacity>
          <TouchableOpacity className="p-3 bg-gray-100 rounded-full flex-row justify-center items-center">
            <Image
              source={require("../assets/images/instagram.png")}
              className="w-10 h-10"
            />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl flex-row justify-center items-center">
            <Image
              source={require("../assets/images/twitter.png")}
              className="w-11 h-11"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7 mb-8">
          <Text className="text-gray-500 font-semibold">
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="font-semibold text-yellow-500"> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
