import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  signupWithEmailAndPassword,
  createUserDocFromAuth,
} from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { setCurrentUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { onAuthStateChangedListener, auth } from "../FirebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";

const SignupScreen = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { currentUser } = useSelector((state) => state.user);
  const auth = getAuth();
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChangedListener((user) => {
  //     if (user) {
  //       createUserDocFromAuth(user);
  //       // navigation.replace("BottomTab");
  //       navigation.replace("homeName");
  //     }

  //     dispatch(setCurrentUser(user));
  //   });

  //   return () => unsubscribe();
  // }, []);

  const handleSignup = async () => {
    // await signupWithEmailAndPassword(email, password);
    if (!email || !password || !username) {
      alert("email or password or username can not be empty");
      return;
    }
    try {
      const { user } = await signupWithEmailAndPassword(email, password);

      const snapshot = await createUserDocFromAuth(user, {
        displayName: username,
      });

      navigation.navigate("Login");
    } catch (error) {
      alert(error);
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("email is already in use");
          break;
        case "auth/weak-password":
          alert("password should be at least 6 characters");
          break;
        default:
          alert(error);
      }
    }
  };
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#877dfa" }}>
      <View className="flex m-4 py-28 ">
        <View className="flex-row justify-center absolute right-9">
          <Image
            source={require("../assets/images/mobile1.png")}
            style={{ width: 300, height: 300 }}
          />
        </View>
      </View>

      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white px-10  justify-center"
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-2 mt-4">User name</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="John smith"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <Text className="text-gray-700 ml-2">Email Address</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Email@gmail.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Text className="text-gray-700 ml-2">Password</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl mb-5"
            secureTextEntry
            placeholder="*********"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity
            onPress={handleSignup}
            className="py-2  bg-yellow-400 rounded-xl"
          >
            <Text className="text-lg font-bold text-center text-gray-700">
              Sign up
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center  mt-7 pt-4 mb-4">
            <Text className="text-gray-500 font-semibold">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="font-semibold text-yellow-500"> Log in</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-sm text-gray-700 font-semibold  text-center py-6">
          Follow us
        </Text>
        <View className="flex-row justify-center space-x-6">
          <View className="p-1 bg-slate-100 rounded-full">
            <MaterialCommunityIcons name="facebook" size={24} color="black" />
          </View>
          <View className="p-1 bg-slate-100 rounded-full">
            <FontAwesome5 name="instagram" size={24} color="black" />
          </View>
          <View className="p-1 bg-slate-100 rounded-full">
            <FontAwesome name="twitter" size={24} color="black" />
          </View>
        </View>
        {/* <View className="flex-row justify-center space-x-12">
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
        </View> */}
      </View>
    </View>
  );
};

export default SignupScreen;
