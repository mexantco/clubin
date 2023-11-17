import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import GuestNavigation from "./GuestNavigation";
import AuthenticationNavigation from "./AuthenticationNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};
import { useDispatch } from "react-redux";
import { setUserData } from "../reducers/user";

const RootNavigation = () => {
  const [user, setUser] = useState({});
  const auth = getAuth();
  const firestore = getFirestore();
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const userData = await getDoc(docRef);
        dispatch(
          setUserData({
            userData: { ...userData.data(), uid: user.uid },
          })
        );
        setUser(user);
      } else {
        dispatch(
          setUserData({
            userData: {},
          })
        );
        setUser({});
      }
    });
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        {user?.uid ? <AuthenticationNavigation /> : <GuestNavigation />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootNavigation;
