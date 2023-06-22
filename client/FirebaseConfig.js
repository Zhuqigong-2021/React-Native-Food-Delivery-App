// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  writeBatch,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);

export const addOrdersCollection = async (order) => {
  // const ordersRef = collection(db, "orders");
  // await setDoc(doc(ordersRef, `${order.user}`), { ...order });
  const ordersRef = collection(db, "orders");

  const docRef = doc(db, "orders", `${order.user}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      orders: arrayUnion(order),
    });
  } else {
    await setDoc(doc(ordersRef, `${order.user}`), { orders: [] });
    await updateDoc(docRef, {
      orders: arrayUnion(order),
    });
  }

  // const docSnap = await getDoc(docRef);
};
export const orderCollectionRef = collection(db, "orders");

// export const orderCollectionRef = (order) => {
//   return collection(db, "orders", order);
// };
export const cancelOrderCollection = async (order) => {
  const ordersRef = collection(db, "orders");
  const docRef = doc(db, "orders", `${order.user}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      orders: arrayRemove(order),
    });
  } else {
    console.log("nothing to remove");
  }
};

export const saveTheme = async (uid, themenumber) => {
  const themeRef = collection(db, "theme");
  await setDoc(doc(themeRef, `${uid}`), { theme: themenumber });
};

export const findTheme = async (uid) => {
  const themeRef = doc(db, "theme", uid);
  const themeSnap = await getDoc(themeRef);

  if (themeSnap.exists()) {
    console.log("theme data:", themeSnap.data().theme);
    return themeSnap.date().theme;
  } else {
    console.log("No such theme document!");
  }
};

export const readOrderData = async (uid) => {
  const docRef = doc(db, "orders", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
};

export const createUserDocFromAuth = async (userAuth, payload) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createAt,
        ...payload,
      });
      updateProfile(auth?.currentUser, payload);
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }
  return userSnapshot;
};

export const signupWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  const data = await signInWithEmailAndPassword(auth, email, password);

  return data;
};

export const signoutUser = async () => {
  return await signOut(auth);
};

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};

export const createAuthUserWithEmailAndPassword = async (
  email,
  password
  // displayName
) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
    // displayName
  );
};

export const addLike = async (uid, likedDish) => {
  try {
    const likeRef = collection(db, "LikedDishes");
    const docRef = doc(db, "LikedDishes", `${uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        likedDishes: arrayUnion(likedDish),
      });
    } else {
      await setDoc(doc(likeRef, `${uid}`), { likedDishes: [] });
      await updateDoc(docRef, {
        likedDishes: arrayUnion(likedDish),
      });
    }

    console.log("Like added successfully!", doc);
    // setLiked(true);
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

export const cancelLike = async (uid, likedDish) => {
  try {
    const docRef = doc(db, "LikedDishes", `${uid}`);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        likedDishes: arrayRemove(likedDish),
      });
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};
